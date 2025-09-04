import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Down_right_dark_arrow,
  Footer_email,
  Footer_location,
  Footer_logo,
  Footer_phone,
} from "@/assets/"; // Ensure these asset imports are correct
import { BASE_URL } from "@/config/api";
import { useAdmin } from "@/contexts/AdminContext";
import { LoadingSpinner, AdminMetaControls } from "@/components/";

export const Footer = () => {
  const { isAdmin } = useAdmin();
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshMetaKey, setRefreshMetaKey] = useState(0);

  const defaultFooterData = useMemo(
    () => ({
      footerHeadline: "Contact Us",
      footerSubtext:
        "If you have any inquiries, please contact us via following email or telephone number. We would also be thrilled to have you visit our lab!",
      footerAddress:
        "#904 Room, 104 Building, UNIST, 50-gil, Eonyang-eup, Ulju-gun, Ulsan, S.Korea",
      footerAddressLink: "https://map.naver.com/p/search/UNIST/place/16601096?c=18.34,0,0,0,dh",
      footerPhone: "+82-52-217-2714",
      footerEmail: "kmyung@unist.ac.kr",
    }),
    []
  );

  const fetchFooterData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/meta/footer`);
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Footer meta data not found, using defaults.");
          setFooterData(defaultFooterData);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        setFooterData(data);
      }
    } catch (err) {
      setError(err.message);
      setFooterData(defaultFooterData); // Fallback to defaults on any error
      console.error("Failed to fetch footer meta:", err);
    } finally {
      setLoading(false);
    }
  }, [defaultFooterData]); // defaultFooterData is stable

  useEffect(() => {
    fetchFooterData();
  }, [fetchFooterData, refreshMetaKey]);

  const handleMetaUpdated = () => {
    setRefreshMetaKey((prev) => prev + 1);
  };

  const displayData = footerData || defaultFooterData;

  // Simple logic to emphasize the last word of the headline
  let headlineMain = displayData.footerHeadline || "";
  let headlineEmphasis = "";
  const lastSpaceIndex = headlineMain.lastIndexOf(" ");
  if (lastSpaceIndex !== -1 && lastSpaceIndex < headlineMain.length - 1) {
    // Ensure space is not last char
    headlineEmphasis = headlineMain.substring(lastSpaceIndex + 1);
    headlineMain = headlineMain.substring(0, lastSpaceIndex);
  }

  // Conditional rendering for loading state to avoid rendering admin controls too early
  if (loading && !footerData) {
    // Only show full page loader if initialData is not yet available
    return (
      <footer className="p-10 text-center bg-text_black_primary text-white">
        <LoadingSpinner message="Loading Footer..." />
      </footer>
    );
  }
  // Non-blocking error for footer, will use defaults
  if (error && !footerData) {
    console.error("Footer display error:", error);
  }

  return (
    <>
      {/* Admin controls are rendered outside and above the main footer element */}
      {isAdmin && (
        <AdminMetaControls
          pageIdentifier="footer"
          initialData={displayData} // Pass the current data (could be defaults)
          fieldsConfig={[
            {
              name: "footerHeadline",
              label: "Footer Title (e.g., Contact Us)",
              type: "text",
              hint: "The last word will be emphasized.",
            },
            { name: "footerSubtext", label: "Footer Subtext/Description", type: "textarea" },
            { name: "footerAddress", label: "Address (Text Display)", type: "text" },
            { name: "footerAddressLink", label: "Address Map URL", type: "url" },
            { name: "footerPhone", label: "Phone Number", type: "tel" },
            { name: "footerEmail", label: "Email Address", type: "email" },
          ]}
          onUpdateSuccess={handleMetaUpdated}
          // Ensure admin controls are visible against any background
          containerClass="p-4 border-t border-gray-200 w-full bg-gray-50 text-gray-800"
        />
      )}
      <footer
        id="contact" // For HashLink scrolling
        className="relative flex flex-col justify-center bg-text_black_primary p-[30px] w-full h-fit sm:grid sm:grid-cols-2 sm:grid-rows-2 sm:items-center sm:justify-items-end"
      >
        <Down_right_dark_arrow className="hidden sm:block size-32 absolute bottom-[30px] right-[30px] sm:col-start-2 sm:row-start-2 sm:static sm:justify-self-end sm:self-end sm:rotate-0" />{" "}
        {/* Adjusted for grid layout */}
        <div className="flex flex-col gap-[10px] m-auto sm:m-0 sm:col-start-1 sm:row-start-1 sm:justify-self-start sm:self-center">
          <h1 className="font-light text-[54px] sm:text-[64px] text-text_white_primary leading-tight sm:leading-[72px]">
            {headlineMain} <span className="text-primary_main">{headlineEmphasis}</span>
          </h1>
          <p className="text-[12px] text-text_white_tertiary max-w-md">
            {" "}
            {/* Max width for readability */}
            {displayData.footerSubtext}
          </p>
        </div>
        <div className="flex flex-col gap-[10px] text-text_white_secondary my-12 sm:my-0 mx-auto sm:m-0 sm:col-start-1 sm:row-start-2 sm:justify-self-start sm:self-center">
          {displayData.footerAddress && (
            <a
              className="flex items-center gap-[10px] hover:text-primary_main transition-colors"
              href={displayData.footerAddressLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Footer_location className="w-6 h-6 flex-shrink-0" />
              <p className="text-sm">{displayData.footerAddress}</p>
            </a>
          )}
          {displayData.footerPhone && (
            <a
              href={`tel:${displayData.footerPhone}`}
              className="flex items-center gap-[10px] hover:text-primary_main transition-colors"
            >
              <Footer_phone className="w-6 h-6 flex-shrink-0" />
              <span className="text-sm">{displayData.footerPhone}</span>
            </a>
          )}
          {displayData.footerEmail && (
            <a
              href={`mailto:${displayData.footerEmail}`}
              className="flex items-center gap-[10px] hover:text-primary_main transition-colors"
            >
              <Footer_email className="w-6 h-6 flex-shrink-0" />
              <span className="text-sm">{displayData.footerEmail}</span>
            </a>
          )}
        </div>
        <div className="mx-auto mt-8 sm:mt-0 sm:mx-0 sm:col-start-2 sm:row-start-1 sm:justify-self-end sm:self-start">
          {" "}
          {/* Adjusted for logo positioning */}
          <Footer_logo
            alt="IIDL Lab Logo" // Important for accessibility
            className="h-10 sm:h-12 w-auto" // Adjust size as needed
          />
        </div>
      </footer>
    </>
  );
};

export default Footer;
