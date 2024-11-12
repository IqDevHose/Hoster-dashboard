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

// Define the schema compatible with backend
const schema = z.object({
  domain: z.string().min(1, "Domain name is required"),
  domainAlt1: z.string().min(1, "Alternative domain is required"),
  domainAlt2: z.string().optional(),
  domainPurpose: z.enum([
    "ART_GALLERY",
    "COMPANY",
    "ECOMMERCE",
    "EDUCATIONAL",
    "KEEP_THE_DOMAIN",
    "MOBILE_APP",
    "NEWS_PLATFORM",
    "PROMOTIONAL",
    "PERSONAL_BLOG",
    "COMUNITY",
    "OTHER",
  ]),
  domainDuration: z.enum(["YEAR", "TWO_YEAR", "THREE_YEAR"]),
  domainType: z
    .enum(["IQ", "COM_IQ", "NET_IQ", "ORG_IQ", "NAME_IQ", "TV_IQ"])
    .optional(),
  applicantName: z.string().min(2, "Name must be at least 2 characters"),
  applicantDocType: z.enum(["NATIONAL_ID", "PASSPORT", "OTHER"]),
  applicantDocFile: z.string().min(1, "Document file is required"),
  applicantGovernorate: z.string().min(1, "Governorate is required"),
  applicantCity: z.string().min(1, "City is required"),
  applicantStreet: z.string().optional(),
  applicantPhone: z.string().min(1, "Phone number is required"),
  applicantEmail: z.string().email("Invalid email address"),
  companyName: z.string().min(1, "Company name is required"),
  companyType: z.string().min(1, "Company type is required"),
  commercialRegistrationNumber: z.string().optional(),
  companyMainAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().email("Invalid company email address").optional(),
  isApplicantManager: z.boolean(),
  managerName: z.string().optional(),
  managerAddress: z.string().optional(),
  managerPhone: z.string().optional(),
  managerEmail: z.string().email("Invalid manager email address").optional(),
  planId: z.number().default(1), // Default to planId 1 if not specified
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
      // Transform data if necessary before sending
      return await axiosInstance.post("/records", data);
    },
    onSuccess: () => {
      navigate("/leads");
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data)
    // mutation.mutate(data);
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
              name={field as keyof FormData}
              control={control}
              render={({ field }) =>
                field.name === "isApplicantManager" ? (
                  <Checkbox
                    {...field}
                    id={field.name}
                    disabled={mutation.isLoading}
                  />
                ) : (
                  <Input
                    {...field}
                    id={field.name}
                    type={
                      field.name.includes("Email") ? "email" : "text"
                    }
                    disabled={mutation.isLoading}
                    className={`${errors[field.name] ? "border-red-500" : ""}`}
                  />
                )
              }
            />
            {errors[field as keyof FormData] && (
              <p className="text-red-500">
                {errors[field as keyof FormData]?.message}
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center">
          <Button type="submit" variant="default" disabled={mutation.isLoading}>
            {mutation.isLoading ? <Spinner size="sm" /> : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddLead;
