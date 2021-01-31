import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import {ProductFormValues} from "../../../models/product";
import { v4 as uuid } from "uuid";
// import LoadingComponent from "../../../../LoadingComponent";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../common/form/TextInput";
import TextAreaInput from "../../../common/form/TextAreaInput";
import SelectInput from "../../../common/form/SelectInput";
import DateInput from "../../../common/form/DateInput";

import { category } from "../../../common/options/categoryOptions";
import { combineDateAndTime } from "../../../common/util/util";
import {combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from 'revalidate';
import { RootStoreContext } from "../../../stores/rootStore";

const validate = combineValidators({
  title: isRequired({message: 'The event title is required'}),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({message: 'Description nneds to be at least 5 charectors'})
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time'),
})


interface DetailParams {
  id: string;
}

const ProductForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createproduct,
    editproduct,
    submittingProduct,
    loadproduct,
    deleteproduct
  } = rootStore.productStore;

  const [product, setproduct] = useState(new ProductFormValues());
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadproduct(match.params.id)
        .then(product => {
          setproduct(new ProductFormValues(product));
        })
        .finally(() => setLoading(false));
    }
  }, [loadproduct, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    // const dateAndTime = combineDateAndTime( new Date(Date.now()),new Date(Date.now()));
    const { date, time, ...product } = values;
    product.date = dateAndTime;

    if (!product.id) {
      let newproduct = {
        ...product,
        id: uuid(),
      };
      createproduct(newproduct);
    } else {
      editproduct(product);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
          validate={validate}
            initialValues={product}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={product.title}
                  component={TextInput}
                />
                <Field
                  name="description"
                  placeholder="Description"
                  value={product.description}
                  rows={3}
                  component={TextAreaInput}
                />
                <Field
                  name="category"
                  placeholder="Category"
                  options={category}
                  value={product.category}
                  component={SelectInput}
                />
                <Form.Group width="equal">
                  <Field
                    name="date"
                    placeholder="Date"
                    value={product.time}
                    component={DateInput}
                    date={true}
                  />
                  <Field
                    name="time"
                    placeholder="Time"
                    value={product.time}
                    component={DateInput}
                    time={true}
                  />
                </Form.Group>
                {/* <Field
                  name="city"
                  component={TextInput}
                  placeholder="City"
                  value={product.city}
                /> */}
                {/* <Field
                  name="venue"
                  placeholder="Venue"
                  value={product.venue}
                  component={TextInput}
                /> */}
                <Button
                  loading={submittingProduct}
                  disabled={loading || invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  onClick={product.id ? () => history.push(`/products/${product.id}`) : () => history.push("/products")}
                  disabled={loading}
                  floated="right"
                  type="button"
                  content="Cancel"
                />
                    {product.id && 
                <Button
                 onClick={(e)=>deleteproduct(e,product.id!).then(()=> history.push('/products'))}
                 
                 disabled={loading}
                 floated="right"
                 type="button"
                 content="Delete"
                />
                }
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProductForm);
