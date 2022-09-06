/* eslint-disable no-unused-vars */
import { Form, Formik, FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Spinner } from "../ui/Spinner";
import { InputStars } from "./InputStars";

const STARS = 5;

interface ReviewFormProps {
  productId: string;
}

interface Variables {
  id: string;
  rating: number;
  comment: string;
}

const initialValues = {
  id: "",
  rating: 0,
  comment: "",
};

const validationSchema = yup.object({
  id: yup.string().uuid(),
  rating: yup.number(),
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

  const onHandleSubmit = async (
    values: Variables,
    { setSubmitting }: FormikHelpers<Variables>
  ) => {
    try {
      const res = await fetch("/api/review", {
        body: JSON.stringify({
          product: productId,
          rating: values.rating,
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
              <>
                <InputStars
                  initialStars={previousRating}
                  setRating={setRating}
                />
                <input
                  name="comment"
                  placeholder={comment || "How did it turn out?"}
                  // label="Comment"
                  type="textarea"
                  // textarea
                />
                <button className="mt-4" type="submit">
                  {isSubmitting ? "Loading" : "Review"}
                </button>
              </>
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
