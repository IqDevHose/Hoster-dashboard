import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useMutation } from "@tanstack/react-query";

// Define Zod schema for form validation
const planSchema = z.object({
  name: z.object({
    en: z.string().min(2, "Name in English must be at least 2 characters"),
    ar: z.string().min(2, "Name in Arabic must be at least 2 characters"),
  }),
  description: z.object({
    en: z
      .string()
      .min(10, "Description in English must be at least 10 characters"),
    ar: z
      .string()
      .min(10, "Description in Arabic must be at least 10 characters"),
  }),
  price: z.number(),
});

type FormData = z.infer<typeof planSchema>;

const AddPlan: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: { en: "", ar: "" },
      description: { en: "", ar: "" },
      price: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => axiosInstance.post(`/plan`, data),
    onError: () => setError("Failed to add Plan"),
    onSuccess: () => {
      navigate("/plans");
      reset();
    },
  });

  const onSubmit = (data: FormData) => {
    setError(null); // Clear previous errors
    mutation.mutate(data);
  };

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Add Plan" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* English Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="nameEn">Plan Name (English)</label>
          <Controller
            name="name.en"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`border rounded p-2 ${
                  errors.name?.en ? "border-red-500" : ""
                }`}
              />
            )}
          />
          {errors.name?.en && (
            <p className="text-red-500">{errors.name.en.message}</p>
          )}
        </div>

        {/* Arabic Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="nameAr">Plan Name (Arabic)</label>
          <Controller
            name="name.ar"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`border rounded p-2 ${
                  errors.name?.ar ? "border-red-500" : ""
                }`}
              />
            )}
          />
          {errors.name?.ar && (
            <p className="text-red-500">{errors.name.ar.message}</p>
          )}
        </div>

        {/* English Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="descriptionEn">Description (English)</label>
          <Controller
            name="description.en"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className={`border rounded p-2 ${
                  errors.description?.en ? "border-red-500" : ""
                }`}
              />
            )}
          />
          {errors.description?.en && (
            <p className="text-red-500">{errors.description.en.message}</p>
          )}
        </div>

        {/* Arabic Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="descriptionAr">Description (Arabic)</label>
          <Controller
            name="description.ar"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className={`border rounded p-2 ${
                  errors.description?.ar ? "border-red-500" : ""
                }`}
              />
            )}
          />
          {errors.description?.ar && (
            <p className="text-red-500">{errors.description.ar.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2">
          <label htmlFor="price">Price</label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`border rounded p-2 ${
                  errors.price ? "border-red-500" : ""
                }`}
              />
            )}
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500">{error}</div>}

        {/* Submit Button */}
        <Button type="submit" variant="outline" disabled={mutation.isPending}>
          {mutation.isPending ? <Spinner size="sm" /> : "Add Plan"}
        </Button>
      </form>
    </div>
  );
};

export default AddPlan;
