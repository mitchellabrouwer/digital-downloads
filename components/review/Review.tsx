/* eslint-disable no-unused-vars */
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Spinner } from "../ui/Spinner";
import { InputStars } from "./InputStars";

const STARS = 5;

interface ReviewFormProps {
  productId: string;
}

interface Variables {
  comment: string;
}

const initialValues = {
  comment: "",
};

const validationSchema = yup.object({
  comment: yup.string(),
});

export const Review: React.FC<ReviewFormProps> = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState();
  const [previousRating, setPreviousRating] = useState<boolean[]>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getReview = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/review?product=${productId}`);

        const data = await res.json();

        console.log("data", data);

        if (data !== null) {
          setRating(data.rating || 0);
          setComment(data.comment || "");
          setPreviousRating(
            [...Array(STARS)].map((_, index) => index <= data.rating)
          );
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    getReview();
  }, [productId]);
  console.log(productId);

  const onHandleSubmit = async (
    values: Variables,
    { setSubmitting }: FormikHelpers<Variables>
  ) => {
    console.log(values);

    try {
      const res = await fetch("/api/review", {
        body: JSON.stringify({
          product: productId,
          rating,
          comment: values.comment,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = await res.json();
      if (data.rating) {
        setRating(data.rating || 0);
        setPreviousRating(
          [...Array(STARS)].map((_, index) => index <= data.rating)
        );
      }

      setSubmitting(false);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("is loading", isLoading);

  return (
    <div className="p-4">
      <Formik
        initialValues={initialValues}
        onSubmit={onHandleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            {!isLoading ? (
              <div className="text-center">
                <div className="text-center">
                  <Field
                    as="textarea"
                    name="comment"
                    placeholder={comment || "What did you think?"}
                    type="textarea"
                    className="my-2 w-full rounded-lg border p-1"
                    value={comment}
                    rows="4"
                  />
                  <InputStars
                    initialStars={previousRating}
                    setRating={setRating}
                  />
                </div>
                <button
                  className="mt-5 mr-1 mb-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                  type="submit"
                >
                  {isSubmitting ? "Loading" : "Review"}
                </button>
              </div>
            ) : (
              <Spinner />
            )}
            {/* 
            {reviewUpdated && (
              <CustomAlert
                status="success"
                text="🙏 thanks for your feedback"
              />
            )}
            {isError && (
              <CustomAlert status="error" text="Something went wrong :" />
            )} */}
          </Form>
        )}
      </Formik>
    </div>
  );
};
