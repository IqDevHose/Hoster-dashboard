import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
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
    en: z.string().min(10, "Description in English must be at least 10 characters"),
    ar: z.string().min(10, "Description in Arabic must be at least 10 characters"),
  }),
  price: z.number().nonnegative("Price must be a positive number"),
  advantages: z
    .array(
      z.object({
        id: z.number(),
        name: z.object({
          en: z.string().min(2, "Advantage in English must be at least 2 characters"),
          ar: z.string().min(2, "Advantage in Arabic must be at least 2 characters"),
        }),
      })
    )
    .optional(),
});

type FormData = z.infer<typeof planSchema>;

const EditPlan = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      advantages: [],
    },
  });

  const { fields: advantagesFields, append, update } = useFieldArray({
    control,
    name: "advantages",
  });

  useEffect(() => {
    if (location.state?.plan) {
      reset(location.state.plan);
      setLoading(false);
    } else {
      axiosInstance.get(`/plans/${id}`)
        .then((res) => {
          reset(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load plan data");
          setLoading(false);
        });
    }
  }, [id, location.state, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => axiosInstance.put(`/plans/${id}`, data),
    onSuccess: () => {
      navigate("/plans");
    },
    onError: (error) => {
      setError("Failed to update the plan");
    },
  });

  const onSubmit = async (data: FormData) => {
    mutation.mutate(data);
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-10">
      <PageTitle title="Edit Plan" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-5 w-full mx-auto">
        {/* Plan Name Fields */}
        <div className="flex flex-col gap-2">
          <label htmlFor="nameEn">Plan Name (English)</label>
          <Controller
            name="name.en"
            control={control}
            render={({ field }) => (
              <input {...field} type="text" className={`border rounded p-2 ${errors.name?.en ? "border-red-500" : ""}`} />
            )}
          />
          {errors.name?.en && <p className="text-red-500">{errors.name.en.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="nameAr">Plan Name (Arabic)</label>
          <Controller
            name="name.ar"
            control={control}
            render={({ field }) => (
              <input {...field} type="text" className={`border rounded p-2 ${errors.name?.ar ? "border-red-500" : ""}`} />
            )}
          />
          {errors.name?.ar && <p className="text-red-500">{errors.name.ar.message}</p>}
        </div>

        {/* Description Fields */}
        <div className="flex flex-col gap-2">
          <label htmlFor="descriptionEn">Description (English)</label>
          <Controller
            name="description.en"
            control={control}
            render={({ field }) => (
              <textarea {...field} className={`border rounded p-2 ${errors.description?.en ? "border-red-500" : ""}`} />
            )}
          />
          {errors.description?.en && <p className="text-red-500">{errors.description.en.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="descriptionAr">Description (Arabic)</label>
          <Controller
            name="description.ar"
            control={control}
            render={({ field }) => (
              <textarea {...field} className={`border rounded p-2 ${errors.description?.ar ? "border-red-500" : ""}`} />
            )}
          />
          {errors.description?.ar && <p className="text-red-500">{errors.description.ar.message}</p>}
        </div>

        {/* Price Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="price">Price</label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <input {...field} type="number" className={`border rounded p-2 ${errors.price ? "border-red-500" : ""}`} />
            )}
          />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>

        {/* Advantages Section */}
        <div className="flex flex-col gap-2">
          <label>Advantages</label>
          {advantagesFields.map((advantage, index) => (
            <div key={advantage.id} className="flex gap-4 items-center">
              <div className="flex-1">
                <Controller
                  name={`advantages.${index}.name.en`}
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="text" className={`border rounded p-2 w-full ${errors.advantages?.[index]?.name?.en ? "border-red-500" : ""}`} />
                  )}
                />
                {errors.advantages?.[index]?.name?.en && (
                  <p className="text-red-500">{errors.advantages[index].name.en.message}</p>
                )}
              </div>

              <div className="flex-1">
                <Controller
                  name={`advantages.${index}.name.ar`}
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="text" className={`border rounded p-2 w-full ${errors.advantages?.[index]?.name?.ar ? "border-red-500" : ""}`} />
                  )}
                />
                {errors.advantages?.[index]?.name?.ar && (
                  <p className="text-red-500">{errors.advantages[index].name.ar.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-start gap-2">
          <Button type="submit" disabled={mutation.isPending}>Save Changes</Button>
          <Button variant="ghost" onClick={() => navigate("/plans")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default EditPlan;
