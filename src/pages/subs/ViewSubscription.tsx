import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import Handlebars from "handlebars";

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

  const handlePrint = () => {
    // Define the Handlebars template as a string
    const template = `
    <div style="width: 210mm; padding: 20px; font-family: Arial, sans-serif; direction: rtl;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <div style="display: flex; align-items: center;">
          <img src="/iq.png" alt="Hoster.iq Logo" style="height: 35px;">
        </div>
        <div>
          <img src="/hoster.png" alt="Iraq Logo" style="height: 35px;">
        </div>
      </div>
  
      <!-- Company Description -->
      <div style="font-size: 12px; color: #666; margin-bottom: 15px; text-align: right;">
        شركة حد السيف للدعاية والاعلان والمسجل المعتمد من هيئة الاعلام والاتصالات بعقد الترخيص: 63 بتاريخ 11/06/2024
      </div>
  
      <!-- Client Info Grid - New Layout -->
      <div style="margin-bottom: 20px;">
        <!-- Top Row - Name and Phone -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 15px;">
        <div> 
            <div >اسم العميل: <br/><span style="color: #0066cc; font-size: 20px; font-weight: bold;">{{clientName}}</span></div>
        </div>
          <div>
            <div>رقم الهاتف: {{phoneNumber}}</div>
          </div>
        </div>
        
        <!-- Bottom Row - Other Info -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
          <div>
            <div style="margin-bottom: 10px;">تاريخ عرض السعر</div>
            <div style="color: #666;">{{submissionDate}}</div>
          </div>
          <div>
            <div style="margin-bottom: 10px;">انتهاء الصلاحية</div>
            <div style="color: #666;">{{expiryDate}}</div>
          </div>
          <div>
            <div style="margin-bottom: 10px;">الخطة المتكررة</div>
            <div style="color: #666;">شهرياً</div>
          </div>
          <div>
            <div style="margin-bottom: 10px;">مندوب المبيعات</div>
            <div style="color: #666;">Sales</div>
          </div>
        </div>
      </div>
  
      <!-- Rest of the template remains the same -->
      <!-- Invoice Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="padding: 10px; text-align: right; background-color: #4e46e5; color: white;">الوصف</th>
            <th style="padding: 10px; text-align: right; background-color: #4e46e5; color: white;">سعر الوحدة</th>
            <th style="padding: 10px; text-align: right; background-color: #4e46e5; color: white;">المبلغ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">اشتراك الخطة العادية</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">240,000,000</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">د.ع 240,000,000</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">Domain .IQ</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">60,000,000</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">د.ع 60,000,000</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Renewal Notice -->
      <div style="text-align: right; margin-top: -15px; margin-bottom: 20px; color: #666; font-size: 14px;">
        يتم تجديد الاستضافة سنوياً
      </div>
  
      <!-- Totals -->
 <div style="direction: rtl;">
  <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid black;">
      <td style="text-align: right; padding: 10px;">إجمالي المبلغ:</td>
      <td style="text-align: left; padding: 10px;">د.ع 300,000,000</td>
    </tr>
    <tr style="border-bottom: 1px solid black;">
      <td style="text-align: right; padding: 10px;">تم دفع:</td>
      <td style="text-align: left; padding: 10px;">د.ع 150,000,000</td>
    </tr>
  </table>
</div>
  
      <!-- Footer -->
      <div style="margin-top: 40px; text-align: center;">
        <p style="font-weight: bold; margin-bottom: 15px;">شكراً لكم</p>
        <p style="font-size: 12px; color: #666; margin-bottom: 5px;">مكتب بغداد: كرادة خارج, بغداد, 10001</p>
        <p style="font-size: 12px; color: #666; margin-bottom: 5px;">مكتب البصرة: فندق جراند ملينيوم السيف بصرة</p>
        <p style="font-size: 12px; color: #666;">الشروط والأحكام https://www.hoster.iq/terms</p>
      </div>
    </div>
  `;
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Generate the HTML with dynamic data
    const renderedHTML = compiledTemplate(subscription);

    // Open a new window and print the content
    const printWindow = window.open("", "", "width=900,height=650");
    printWindow?.document.write(
      "<html><head><title>Invoice</title></head><body>"
    );
    printWindow?.document.write(renderedHTML);
    printWindow?.document.write("</body></html>");
    printWindow?.document.close();
    printWindow?.print();
  };

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

      {/* Create Invoice Button */}
      <div className="mt-6">
        <Button
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Create Invoice
        </Button>
      </div>
    </div>
  );
};

export default ViewSubscription;
