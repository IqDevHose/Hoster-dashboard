import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/PageTitle";
import axiosInstance from "@/utils/AxiosInstance";
import Loading from "@/components/Loading";

// Define the Plan type
type Plan = {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  price: string;
  description: {
    ar: string;
    en: string;
  };
};

export default function EditPlan() {
  const { id } = useParams<{ id: string }>(); // Extract the plan ID from the URL
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch plan details on component mount
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axiosInstance.get(`/plans/${id}`);
        setPlan(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load plan details");
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  // Handle form changes
  const handleChange = (field: keyof Plan, value: string) => {
    setPlan((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleNameChange = (lang: "ar" | "en", value: string) => {
    setPlan((prev) => prev ? { ...prev, name: { ...prev.name, [lang]: value } } : prev);
  };

  const handleDescriptionChange = (lang: "ar" | "en", value: string) => {
    setPlan((prev) => prev ? { ...prev, description: { ...prev.description, [lang]: value } } : prev);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await axiosInstance.put(`/plans/${id}`, plan); // Update the plan on the backend
      navigate("/plans"); // Redirect to the plans page after saving
    } catch (err) {
      setError("Failed to update the plan");
    }
  };

  // Render loading or error message
  // if (loading) return <Loading />;
  // if (error) return <div>{error}</div>;

  return (
    <div className="p-10">
      <PageTitle title="Edit Plan" />
      <div className="flex flex-col gap-5 pt-5 w-full mx-auto">

        {/* English Name */}
        <label className="flex flex-col gap-1">
          <span>Plan Name (English)</span>
          <input
            type="text"
            value={plan?.name.en || ""}
            onChange={(e) => handleNameChange("en", e.target.value)}
            className="border  rounded p-2"
          />
        </label>

        {/* Arabic Name */}
        <label className="flex flex-col gap-1">
          <span>Plan Name (Arabic)</span>
          <input
            type="text"
            value={plan?.name.ar || ""}
            onChange={(e) => handleNameChange("ar", e.target.value)}
            className="border rounded p-2"
          />
        </label>

        {/* English Description */}
        <label className="flex flex-col gap-1">
          <span>Description (English)</span>
          <textarea
            value={plan?.description.en || ""}
            onChange={(e) => handleDescriptionChange("en", e.target.value)}
            className="border rounded p-2"
          />
        </label>

        {/* Arabic Description */}
        <label className="flex flex-col gap-1">
          <span>Description (Arabic)</span>
          <textarea
            value={plan?.description.ar || ""}
            onChange={(e) => handleDescriptionChange("ar", e.target.value)}
            className="border rounded p-2"
          />
        </label>

        {/* Price */}
        <label className="flex flex-col gap-1">
          <span>Price</span>
          <input
            type="text"
            value={plan?.price || ""}
            onChange={(e) => handleChange("price", e.target.value)}
            className="border rounded p-2"
          />
        </label>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => navigate("/plans")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
