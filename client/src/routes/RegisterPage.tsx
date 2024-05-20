import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useRegisterToEventMutation } from "../services/eventsApi";
import { useEffect } from "react";

enum HearFrom {
  social = "Social",
  friend = "Friends",
  found = "Found myself",
}

interface IFormInput {
  fullName: string;
  email: string;
  dateOfBirth: string;
  hearFrom: HearFrom;
}

const RegisterPage = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [
    sendCreds, // This is the mutation trigger
    { error, isSuccess, isError }, // This is the destructured mutation result
  ] = useRegisterToEventMutation();

  const { register, handleSubmit } = useForm<IFormInput>();

  const from = ["Social", "Friends", "Found myself"];

  useEffect(() => {
    if (isSuccess) {
      navigate(`/event/${eventId}`);
    }
  }, [eventId, isSuccess, navigate]);

  const onSubmit: SubmitHandler<IFormInput> = (formData) => {
    console.log(formData);
    return sendCreds({
      id: eventId!,
      user: formData,
    });
  };

  const dateValid = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;

  const regEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const message = isError && "data" in error && JSON.stringify(error.data);

  return (
    <div className="flex flex-col w-full justify-center items-center h-full">
      <form
        className="flex flex-col gap-2 bg-base-100 p-4 md:w-1/2 rounded-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label>Full Name</label>
        <input
          autoFocus
          required
          className="input input-bordered w-full"
          placeholder="Full Name"
          type="text"
          {...register("fullName", {
            required: true,
            maxLength: 50,
            minLength: 2,
          })}
        />
        <input
          required
          type="email"
          placeholder="Your Email"
          className="input input-bordered w-full"
          {...register("email", {
            required: true,
            pattern: regEmail,
            minLength: 5,
          })}
        />
        <input
          className="input input-bordered w-full"
          type="date"
          name=""
          id=""
          {...register("dateOfBirth", {
            required: true,
            pattern: dateValid,
          })}
        />
        <fieldset className="flex justify-between" style={{ float: "left" }}>
          <legend>Where did you hear about this event?</legend>
          {from.map((c) => (
            <label key={c} className="label cursor-pointer">
              <input
                className="radio radio-accent mr-2"
                required
                type="radio"
                value={c}
                {...register("hearFrom")}
              />
              <span className="label-text"> {c}</span>
            </label>
          ))}
        </fieldset>
        <input className="btn btn-accent" type="submit" />
      </form>

      {isError && (
        <div className="container text-error text-center">
          {JSON.stringify(message)}
        </div>
      )}

      {isSuccess && (
        <div>
          <h3>Resopnse Data: </h3>
          <div>Done!</div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
