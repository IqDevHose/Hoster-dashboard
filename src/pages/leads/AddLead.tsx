import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Define the schema
const schema = z.object({
  domainName: z.string().min(1, "Domain name is required"),
  iraqiDomain: z.string().optional(),
  purpose: z.string().min(1, "Purpose is required"),
  bookingPeriod: z.string().min(1, "Booking period is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  identityType: z.string().min(1, "Identity type is required"),
  governate: z.string().min(1, "Governate is required"),
  city: z.string().min(1, "City is required"),
  street: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email("Invalid email address"),
  companyName: z.string().min(1, "Company name is required"),
  businessType: z.string().min(1, "Business type is required"),
  registrationNumber: z.string().optional(),
  headquartersAddress: z.string().optional(),
  businessPhoneNumber: z.string().optional(),
  businessEmail: z.string().email("Invalid business email address").optional(),
  sameAsApplicantAdmin: z.boolean(),
  adminName: z.string().optional(),
  adminAddress: z.string().optional(),
  adminPhoneNumber: z.string().optional(),
  adminEmail: z.string().email("Invalid admin email address").optional(),
});

type FormData = z.infer<typeof schema>;

const AddLead = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await axiosInstance.post("/records", data);
    },
    onSuccess: () => {
      navigate("/leads");
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Add Lead" />
      {mutation.error && (
        <div className="text-red-500">{(mutation.error as Error).message}</div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Map through each field with Controller */}
        {Object.keys(schema.shape).map((field) => (
          <div className="flex flex-col gap-2" key={field}>
            <label htmlFor={field}>{field}</label>
            <Controller
              name={field}
              control={control}
              render={({ field }) =>
                field.name === "sameAsApplicantAdmin" ? (
                  <Checkbox
                    {...field}
                    id={field.name}
                    disabled={mutation.isPending}
                  />
                ) : (
                  <Input
                    {...field}
                    id={field.name}
                    type={field.name.includes("email") ? "email" : "text"}
                    disabled={mutation.isPending}
                    className={`${errors[field.name] ? "border-red-500" : ""}`}
                  />
                )
              }
            />
            {errors[field.name] && (
              <p className="text-red-500">{errors[field.name].message}</p>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center">
          <Button type="submit" variant="default" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner size="sm" /> : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddLead;
