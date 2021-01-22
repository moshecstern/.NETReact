import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { IProduct } from '../models/product';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { createLikedProduct, setProductProps } from '../common/util/util';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';

const LIMIT = 2;


export default class productStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicateProduct.keys(),
      () => {
        this.pageProduct = 0;
        this.productRegistry.clear();
        this.loadProducts();
      }
    )
  }

  @observable productRegistry = new Map();
  @observable product: IProduct | null = null;
  @observable loadingInitialProduct = false;
  @observable submittingProduct = false;
  @observable targetProduct = '';
  @observable loadingProduct = false;
  @observable.ref hubConnectionProduct: HubConnection | null = null;
  @observable productCount = 0;
  @observable pageProduct = 0;
  @observable predicateProduct = new Map();

  @action setPredicateProduct = (predicate: string, value: string | Date) => {
    this.predicateProduct.clear();
    if (predicate !== 'all') {
      this.predicateProduct.set(predicate, value);
    }
  }

  @computed get axiosParamsProduct() {
    const params = new URLSearchParams();
    params.append('limit', String(LIMIT));
    params.append('offset', `${this.pageProduct ? this.pageProduct * LIMIT : 0}`);
    this.predicateProduct.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, value.toISOString())
      } else {
        params.append(key, value)
      }
    })
    return params;
  }

  @computed get totalPagesProduct() {
    return Math.ceil(this.productCount / LIMIT);
  }

  @action setPageProduct = (page: number) => {
    this.pageProduct = page;
  }

  // @action createHubConnectionProduct = (productId: string) => {
  //   if (!this.hubConnectionProduct) {
  //   this.hubConnectionProduct = new HubConnectionBuilder()
  //     .withUrl(process.env.REACT_APP_API_BLOGCHAT_URL!, {
  //       accessTokenFactory: () => this.rootStore.commonStore.token!
  //     })
  //     .configureLogging(LogLevel.Information)
  //     .build();

  //     this.hubConnectionProduct.on('ReceiveProductComment', (comment) => runInAction(() => this.product!.comments.push(comment)));
  //     this.hubConnectionProduct.on('SendProduct', (message) => {/*toast.info(message)*/});

  //   }
  //     if (this.hubConnectionProduct!.state === "Disconnected") {
  //   this.hubConnectionProduct
  //     .start()
  //     .then(() => console.log(this.hubConnectionProduct!.state))
  //     .then(() => {
  //       console.log('Attempting to join group');
  //       this.hubConnectionProduct!.invoke('AddToGroupProduct', productId)
  //     })
  //     .catch(error => console.log('Error establishing connection: ', error));
  //   } else if(this.hubConnectionProduct!.state === 'Connected'){
  //     this.hubConnectionProduct!.invoke('AddToGroup', productId);
  //   }
  
  //   this.hubConnectionProduct.on('ReceiveProductComment', comment => {
  //     runInAction(() => {
  //       this.product!.comments.push(comment)
  //     })
  //   })

  //   this.hubConnectionProduct.on('SendProduct', message => {
  //     toast.info(message);
  //   })
  // };

  // @action stopHubConnectionProduct = () => {
  //   if (this.hubConnectionProduct?.state === "Connected") {
  //   this.hubConnectionProduct!.invoke('RemoveFromGroupProduct', this.product!.id)
  //     .then(() => {
  //       this.hubConnectionProduct!.stop()
  //     })
  //     .then(() => console.log('Connection stopped'))
  //     .catch(err => console.log(err))
  // }}

  // @action addCommentProduct = async (values: any) => {
  //   values.productId = this.product!.id;
  //   try {
  //     await this.hubConnectionProduct!.invoke('SendCommentProduct', values)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // } 
  @action createHubConnectionProduct = (productId: string) => {
    this.hubConnectionProduct = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_PRODUCTCHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnectionProduct
      .start()
      .then(() => console.log(this.hubConnectionProduct!.state))
      .then(() => {
        console.log('Attempting to join group');
        this.hubConnectionProduct!.invoke('AddToGroupProduct', productId)
      })
      .catch(error => console.log('Error establishing connection: ', error));
// below 'RecieveComment' is related to API.SignalR.HubCOnnection line40
    this.hubConnectionProduct.on('ReceiveProductComment', comment => {
      console.log(comment)
      runInAction(() => {
        this.product!.productComments.push(comment)
      })
    })

    this.hubConnectionProduct.on('SendProduct', message => {
      toast.info(message);
    })
  };

  @action stopHubConnectionProduct = () => {
    this.hubConnectionProduct!.invoke('RemoveFromGroupProduct', this.product!.id)
      .then(() => {
        this.hubConnectionProduct!.stop()
      })
      .then(() => console.log('Connection stopped'))
      .catch(err => console.log(err))
  }

  @action addCommentProduct = async (values: any) => {
    // below values.activityId needs to match whats in Application.create.cs
    values.productId = this.product!.id;
    try {
      await this.hubConnectionProduct!.invoke('SendCommentProduct', values)
    } catch (error) {
      console.log(error);
    }
  } 


  @computed get ProductsByDate() {
    return this.groupProductsByDate(
      Array.from(this.productRegistry.values())
    );
  }

  groupProductsByDate(Products: IProduct[]) {
    const sortedProducts = Products.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedProducts.reduce(
        (Products, product) => {
          const date = product.date.toISOString().split('T')[0];
          Products[date] = Products[date]
            ? [...Products[date], product]
            : [product];
          return Products;
        },
        {} as { [key: string]: IProduct[] }
      )
    );
  }

  @action loadProducts = async () => {
    this.loadingInitialProduct = true;
    try {
      const ProductsEnvelope = await agent.Products.list(this.axiosParamsProduct);
      const {products, productCount} = ProductsEnvelope;
      runInAction(() => {
        products.forEach(product => {
          setProductProps(product, this.rootStore.userStore.user!);
          this.productRegistry.set(product.id, product);
        });
        this.productCount = productCount;
        this.loadingInitialProduct = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitialProduct = false;
      });
    }
  };

  @action loadproduct = async (id: string) => {
    let product = this.getproduct(id);
    if (product) {
      this.product = product;
      return toJS(product);
    } else {
      this.loadingInitialProduct = true;
      try {
        product = await agent.Products.details(id);
        runInAction(() => {
          setProductProps(product, this.rootStore.userStore.user!);
          this.product = product;
          this.productRegistry.set(product.id, product);
          this.loadingInitialProduct = false;
        });
        return product;
      } catch (error) {
        runInAction(() => {
          this.loadingInitialProduct = false;
        });
        console.log(error);
      }
    }
  };

  @action clearproduct = () => {
    this.product = null;
  };

  getproduct = (id: string) => {
    return this.productRegistry.get(id);
  };

  @action createproduct = async (product: IProduct) => {
    this.submittingProduct = true;
    try {
      await agent.Products.create(product);
      const attendee = createLikedProduct(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      product.liked = attendees;
      product.isHost = true;
      runInAction(() => {
        this.productRegistry.set(product.id, product);
        this.submittingProduct = false;
      });
      history.push(`/products/${product.id}`);
    } catch (error) {
      runInAction(() => {
        this.submittingProduct = false;
      });
      toast.error('Problem submitting data');
      console.log(error.response);
    }
  };

  @action editproduct = async (product: IProduct) => {
    this.submittingProduct = true;
    try {
      await agent.Products.update(product);
      runInAction(() => {
        this.productRegistry.set(product.id, product);
        this.product = product;
        this.submittingProduct = false;
      });
      history.push(`/products/${product.id}`);
    } catch (error) {
      runInAction(() => {
        this.submittingProduct = false;
      });
      toast.error('Problem submitting data');
      console.log(error);
    }
  };

  @action deleteproduct = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submittingProduct = true;
    this.targetProduct = event.currentTarget.name;
    try {
      await agent.Products.delete(id);
      runInAction(() => {
        this.productRegistry.delete(id);
        this.submittingProduct = false;
        this.targetProduct = '';
      });
    } catch (error) {
      runInAction(() => {
        this.submittingProduct = false;
        this.targetProduct = '';
      });
      console.log(error);
    }
  };

  @action likeProduct = async () => {
    const attendee = createLikedProduct(this.rootStore.userStore.user!);
    this.loadingProduct = true;
    try {
      await agent.Products.like(this.product!.id);
      runInAction(() => {
        if (this.product) {
          this.product.liked.push(attendee);
          this.product.isLiked = true;
          this.productRegistry.set(this.product.id, this.product);
          this.loadingProduct = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loadingProduct = false;
      })
      toast.error('Problem signing up to product');
    }
  };

  @action unlikeProduct = async () => {
    this.loadingProduct = true;
    try {
      await agent.Products.unlike(this.product!.id);
      runInAction(() => {
        if (this.product) {
          this.product.liked = this.product.liked.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.product.isLiked = false;
          this.productRegistry.set(this.product.id, this.product);
          this.loadingProduct = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loadingProduct = false;
      })
      toast.error('Problem cancelling like');
    }
  };
}
