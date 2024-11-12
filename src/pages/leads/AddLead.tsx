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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

const schema = z.object({
  leadName: z.string().min(1, "Lead name is required"),
  company: z.string().min(1, "Company name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  serviceRequired: z.enum([
    "domain_registration",
    "domain_hosting",
    "ecommerce_website",
    "portfolio_website",
    "other",
  ]),
  leadStatus: z.enum(["cold_lead", "hot_lead", "unsure"]),
  notes: z.string().optional(),
  date: z.string().optional(), // Optional date field
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
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      return await axiosInstance.post("/records", formData, {
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
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Add Sales" />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Sales Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="SalesName">Sales Name</label>
          <Controller
            name="SalesName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="SalesName"
                disabled={mutation.isPending}
                className={errors.leadName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.leadName && (
            <p className="text-red-500">{errors.leadName.message}</p>
          )}
        </div>

        {/* Company */}
        <div className="flex flex-col gap-2">
          <label htmlFor="company">Company</label>
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="company"
                disabled={mutation.isPending}
                className={errors.company ? "border-red-500" : ""}
              />
            )}
          />
          {errors.company && (
            <p className="text-red-500">{errors.company.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label htmlFor="phoneNumber">Phone Number</label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="phoneNumber"
                disabled={mutation.isPending}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
            )}
          />
          {errors.phoneNumber && (
            <p className="text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Service Required */}
        <div className="flex flex-col gap-2">
          <label>Service Required</label>
          <Controller
            name="serviceRequired"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domain_registration">
                    Domain Registration
                  </SelectItem>
                  <SelectItem value="domain_hosting">
                    Domain Registration + Hosting
                  </SelectItem>
                  <SelectItem value="ecommerce_website">
                    Ecommerce Website
                  </SelectItem>
                  <SelectItem value="portfolio_website">
                    Portfolio Website
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.serviceRequired && (
            <p className="text-red-500">{errors.serviceRequired.message}</p>
          )}
        </div>

        {/* sales Status */}
        <div className="flex flex-col gap-2">
          <label>sales Status</label>
          <Controller
            name="leadStatus"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold_lead">Cold Lead</SelectItem>
                  <SelectItem value="hot_lead">Hot Lead</SelectItem>
                  <SelectItem value="unsure">Unsure</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.leadStatus && (
            <p className="text-red-500">{errors.leadStatus.message}</p>
          )}
        </div>

        {/* Date picker input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="selectedDate">Select Date</label>
          <Controller
            name="selectedDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="selectedDate"
                type="date"
                disabled={mutation.isPending}
                className={`${errors.leadStatus ? "border-red-500" : ""}`}
              />
            )}
          />
          {errors.leadStatus && (
            <p className="text-red-500">{errors.leadStatus.message}</p>
          )}
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <label htmlFor="notes">Notes</label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="notes"
                disabled={mutation.isPending}
                rows={4} // Adjust the number of rows to control the height
                className={`border border-gray-300 rounded-md p-2 ${
                  errors.notes ? "border-red-500" : ""
                }`}
                placeholder="Enter your notes here..."
              />
            )}
          />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>

        {mutation.error && (
          <div className="text-red-500">
            {(mutation.error as Error).message}
          </div>
        )}
        {/* Submit Button */}
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
