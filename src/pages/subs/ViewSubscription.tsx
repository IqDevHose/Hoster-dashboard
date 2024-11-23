import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";

const ViewSubscription = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Record<string, any> | null>(
    null
  );

  useEffect(() => {
    axiosInstance
      .get(`/subscriptions/${id}`)
      .then((res) => {
        setSubscription(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load subscription data");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <h1 className="text-2xl font-bold">View Subscription</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Display data in a read-only format */}
        <div>
          <strong>Domain Name:</strong>
          <p>{subscription?.domainName || "N/A"}</p>
        </div>

        <div>
          <strong>Client Name:</strong>
          <p>{subscription?.clientName || "N/A"}</p>
        </div>

        <div>
          <strong>Phone Number:</strong>
          <p>{subscription?.phoneNumber || "N/A"}</p>
        </div>

        <div>
          <strong>Documents Link:</strong>
          <p>
            {subscription?.documentsLink ? (
              <a
                href={subscription.documentsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Documents
              </a>
            ) : (
              "N/A"
            )}
          </p>
        </div>

        <div>
          <strong>Submission Date:</strong>
          <p>{subscription?.submissionDate || "N/A"}</p>
        </div>

        <div>
          <strong>Activation Date:</strong>
          <p>{subscription?.activationDate || "N/A"}</p>
        </div>

        <div>
          <strong>Expiry Date:</strong>
          <p>{subscription?.expiryDate || "N/A"}</p>
        </div>

        <div>
          <strong>Price Sold:</strong>
          <p>{subscription?.price ? `$${subscription.price}` : "N/A"}</p>
        </div>

        <div>
          <strong>Status:</strong>
          <p>{subscription?.status?.replace("_", " ") || "N/A"}</p>
        </div>

        <div>
          <strong>Payment Method:</strong>
          <p>{subscription?.paymentMethod?.replace("_", " ") || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewSubscription;
