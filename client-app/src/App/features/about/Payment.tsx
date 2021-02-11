import React from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../common/form/TextInput";
import SelectInput from "../../common/form/SelectInput";
import TextAreaInput from "../../common/form/TextAreaInput";
import NumberInput from "../../common/form/NumberInput";
import {
  combineValidators,
  isRequired,
  composeValidators,
} from "revalidate";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  "pk_test_51IJgA9HM0ulc8EQnVMUaK1VHDkXDmBP1KsFnOvrlFyWhFIk0uNE2x9XWEKFn5JrFYNYznV9DxR4JJgdXIDq8N5g300iqz1Y3Op"
);

const validate = combineValidators({
  text: isRequired({ message: "The event text is required" }),
  category: isRequired("Category"),
  price: isRequired("Price"),
  description: composeValidators(
    isRequired("Description"),
//     hasLengthGreaterThan(4)({
//       message: "Description nneds to be at least 5 charectors",
//     })
  )(),
});

const DonationsArray = [
  {
    text: "PTSD Treatment",
    price: "$15",
    image: "/",
    key: 'PTSD Treatment',
    value: 'PTSD Treatment'
  },
  {
    text: "donation 2",
    price: "$25",
    image: "/",
    key: 'donation 2',
    value: 'donation 2'
  },
  {
    text: "donation 3",
    price: "$50",
    image: "/",
    key: 'donation 3',
    value: 'donation 3'
  },
];
const Payment = (props: any) => {

    const handleFinalFormSubmit = async (values: any) => {
        console.log(values)
        const customDesc = 'Paid by: ' +values.text + ' & wrote: ' + values.description 
      const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({
      // product: [
      // ],
      // item: [{}],
      // items: [{sku: myDesc}],

      // paymentIntentData: {metadata:{myDesc}},
      clientReferenceId: customDesc,
      // payment_intent_data : [{description: myDesc}],
      lineItems: [
        // Replace with the ID of your price
        // price_1H0IwcLa9svkYtX6HWZ7vWE7
        // price_1GzZ1mLa9svkYtX6p7QAvgYj
        {
          price: "price_1IJhMcHM0ulc8EQnvNZXHzIp",
          quantity: parseInt(values.price),
        },
      ],
      mode: "payment",
      successUrl: "http://localhost:3000/success",
      cancelUrl: "http://localhost:3000/payfail",

      // billingAddressCollection: 'required',
      // description: 'patients name:  '+ patient +'by '+ relationship
    });
    if(error)throw(error);
  };

  return (
    <Segment clearing>
      <FinalForm
        validate={validate}
        onSubmit={handleFinalFormSubmit}
        render={({ handleSubmit, invalid, pristine }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              name="text"
              placeholder="Email"
              //   value={activity.text}
              component={TextInput}
            />
            <Field
              name="category"
              placeholder="Category"
              options={DonationsArray}
            //   value={myCatagory}
              component={SelectInput}
            />
            <Field
              name="price"
              placeholder="Donation Amount"
            //   value={myQuantity}
              component={NumberInput}
            />
            <Field
              name="description"
              placeholder="Message"
                // value={myDescription}
              rows={3}
              component={TextAreaInput}
            />
            <Button
              //   loading={submitting}
              disabled={invalid || pristine}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
          </Form>
        )}
      />
    </Segment>
  );
};

export default Payment;
