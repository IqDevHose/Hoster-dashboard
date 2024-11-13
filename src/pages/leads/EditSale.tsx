import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Loading from "@/components/Loading";

const schema = z.object({
  domain: z.string().min(1, "Domain name is required"),
  domainAlt1: z.string().min(1, "Alternative domain is required"),
  domainAlt2: z.string().optional(),
  domainPurpose: z.enum([
    "art_gallery",
    "company",
    "ecommerce",
    "educational",
    "keep_the_domain",
    "mobile_app",
    "news_platform",
    "promotional",
    "personal_blog",
    "comunity",
    "other",
  ]),
  domainDuration: z.enum(["year", "two_year", "three_year"]),
  domainType: z
    .enum([".iq", ".com.iq", ".net.iq", ".org.iq", ".name.iq", ".tv.iq"])
    .optional(),
  applicantName: z.string().min(2, "Name must be at least 2 characters"),
  applicantDocType: z.enum(["national_id", "passport", "other"]),
  applicantDocFile: z.any().optional(),
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
  planId: z.string(),
});

type FormData = z.infer<typeof schema>;

const EditSale = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: lead, isLoading } = useQuery({
    queryKey: ["sale", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/records-dashboard/${id}`);
      return response.data;
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (lead) {
      reset(lead);
    }
  }, [lead, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "applicantDocFile" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      return await axiosInstance.put(`/records-dashboard/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      navigate("/leads");
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const isApplicantManager = watch("isApplicantManager");
  const applicantName = watch("applicantName");
  const applicantEmail = watch("applicantEmail");
  const applicantPhone = watch("applicantPhone");
  const applicantStreet = watch("applicantStreet");

  useEffect(() => {
    if (isApplicantManager) {
      setValue("managerName", applicantName);
      setValue("managerEmail", applicantEmail);
      setValue("managerPhone", applicantPhone);
      setValue("managerAddress", applicantStreet);
    }
  }, [
    isApplicantManager,
    applicantName,
    applicantEmail,
    applicantPhone,
    applicantStreet,
    setValue,
  ]);

  if (isLoading) return <Loading />;

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Edit Sale" />
      {mutation.error && (
        <div className="text-red-500">{(mutation.error as Error).message}</div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {Object.entries(schema.shape).map(([fieldName, fieldSchema]) => (
          <div className="flex flex-col gap-2" key={fieldName}>
            <label htmlFor={fieldName}>{fieldName}</label>
            <Controller
              name={fieldName as keyof FormData}
              control={control}
              render={({ field }) => {
                if (fieldName === "isApplicantManager") {
                  return (
                    <Switch
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                      disabled={mutation.isPending}
                    />
                  );
                } else if (fieldName === "domainType") {
                  return (
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=".iq">IQ</SelectItem>
                        <SelectItem value=".com.iq">COM IQ</SelectItem>
                        <SelectItem value=".net.iq">NET IQ</SelectItem>
                        <SelectItem value=".org.iq">ORG IQ</SelectItem>
                        <SelectItem value=".name.iq">NAME IQ</SelectItem>
                        <SelectItem value=".tv.iq">TV IQ</SelectItem>
                      </SelectContent>
                    </Select>
                  );
                } else if (fieldName === "domainPurpose") {
                  return (
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="art_gallery">Art Gallery</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="keep_the_domain">
                          Keep the Domain
                        </SelectItem>
                        <SelectItem value="mobile_app">Mobile App</SelectItem>
                        <SelectItem value="news_platform">
                          News Platform
                        </SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="personal_blog">
                          Personal Blog
                        </SelectItem>
                        <SelectItem value="comunity">Community</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  );
                } else if (fieldName === "domainDuration") {
                  return (
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="year">1 Year</SelectItem>
                        <SelectItem value="two_year">2 Years</SelectItem>
                        <SelectItem value="three_year">3 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  );
                } else if (fieldName === "applicantDocType") {
                  return (
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national_id">National ID</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  );
                } else if (fieldName === "applicantDocFile") {
                  return (
                    <input
                      id={fieldName}
                      type="file"
                      disabled={mutation.isPending}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                      className={`${
                        errors.applicantDocFile ? "border-red-500" : ""
                      }`}
                    />
                  );
                } else {
                  return (
                    <Input
                      {...field}
                      id={fieldName}
                      type={fieldName.includes("Email") ? "email" : "text"}
                      disabled={mutation.isPending}
                      className={`${
                        errors[fieldName as keyof FormData]
                          ? "border-red-500"
                          : ""
                      }`}
                      value={
                        typeof field.value === "boolean"
                          ? String(field.value)
                          : field.value?.toString() ?? ""
                      }
                    />
                  );
                }
              }}
            />
            {errors[fieldName as keyof FormData] && (
              <p className="text-red-500">
                {errors[fieldName as keyof FormData]?.message?.toString()}
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-start gap-2">
          <Button type="submit" variant="default" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner size="sm" /> : "Save Changes"}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/sales")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditSale;
