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
import Loading from "@/components/Loading";

const schema = z.object({
  leadName: z.string().min(1, "Lead name is required"),
  company: z.string().min(1, "Company name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  serviceRequired: z.enum([
    "domain_registration",
    "domain_registration_with_hosting",
    "ecommerce_website",
    "portfolio_website",
    "other",
  ]),
  leadStatus: z.enum(["cold_lead", "hot_lead", "unsure"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const EditSale = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: sale, isLoading } = useQuery({
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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (sale) {
      reset(sale);
    }
  }, [sale, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
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

  if (isLoading) return <Loading />;

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Edit Sale" />
      {mutation.error && (
        <div className="text-red-500">{(mutation.error as Error).message}</div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Lead Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="leadName">Lead Name</label>
          <Controller
            name="leadName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="leadName"
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

        {/* Lead Status */}
        <div className="flex flex-col gap-2">
          <label>Lead Status</label>
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
                rows={4}
                disabled={mutation.isPending}
                className={`border border-gray-300 rounded-md p-2 ${
                  errors.notes ? "border-red-500" : ""
                }`}
                placeholder="Enter your notes here..."
              />
            )}
          />
        </div>

        <div className="flex gap-2 items-center">
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
