import { Form, Formik, FormikHelpers } from "formik";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import Heading from "../components/Heading";
import { InputStars } from "../components/review/InputStars";
import { getReview } from "../lib/data";
import prisma from "../lib/prisma";

const STARS = 5;

interface Variables {
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

export const ReviewOld = ({ existingReview }) => {
  const router = useRouter();
  const [rating, setRating] = useState(existingReview?.rating || null);
  const [comment, setComment] = useState(existingReview?.comment || null);
  const [previousRating, setPreviousRating] = useState<boolean[]>();

  // const [isLoading, setIsLoading] = useState<boolean>(false);

  const onHandleSubmit = async (
    values: Variables,
    { setSubmitting }: FormikHelpers<Variables>
  ) => {
    try {
      const res = await fetch("/api/review", {
        body: JSON.stringify({
          productId: router.query.id,
          rating: values.rating,
          comment: values.comment,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "",
      });

      const data = await res.json();
      if (data.rating) {
        setRating(data.rating || 0);
        setComment(data.comment);
        setPreviousRating(
          [...Array(STARS)].map((_, index) => index <= data.rating)
        );
      }

      setSubmitting(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Heading />
      <div className="p-4">
        <Formik
          initialValues={initialValues}
          onSubmit={onHandleSubmit}
          validationSchema={validationSchema}
        >
          {({ isSubmitting }) => (
            <Form>
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
    </div>
  );
};

export default Review;

export async function getServerSideProps(context) {
  const session = await getSession();
  let review = null;

  // get query params
  if (session?.user.id) {
    review = await getReview(session.user.id, context.params.id, prisma);
    review = JSON.parse(JSON.stringify(review));
  }

  return {
    props: {
      existingReview: review,
    },
  };
}
