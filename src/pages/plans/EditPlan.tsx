import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";

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

const EditPlan = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the form with react-hook-form and Zod validation
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

  useEffect(() => {
    // If plan data exists in location state, use it; otherwise, fetch from API
    if (location.state?.plan) {
      reset(location.state.plan);
      setLoading(false);
    }
  }, [id, location.state, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await axiosInstance.put(`/plans/${id}`, data);
      navigate("/plans");
    } catch (err) {
      setError("Failed to update the plan");
    }
  };

  // Loading and error state handling
  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-10">
      <PageTitle title="Edit Plan" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 pt-5 w-full mx-auto"
      >
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => navigate("/plans")}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default EditPlan;
