import React, { useEffect, useState } from "react";
import { getFieldsByStep, submitStep1 } from "../api/api";

export default function Step1Form({ onSuccess }) {
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [showOtp, setShowOtp] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        getFieldsByStep(1).then((res) => {
            if (res?.fields) {
                setFields(res.fields);
            }
        });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Step 1: If OTP not shown yet, validate Aadhaar number
        if (!showOtp) {
            const aadhaarNum = formData["ctl00$ContentPlaceHolder1$txtadharno"] || "";
            if (!/^\d{12}$/.test(aadhaarNum)) {
                setError("Aadhaar number must be exactly 12 digits.");
                return;
            }
            // Aadhaar valid → Show OTP field
            setShowOtp(true);
            return;
        }

        // Step 2: OTP flow
        const otp = formData["ctl00$ContentPlaceHolder1$txtOtp1"] || "";
        if (!/^\d{6}$/.test(otp)) {
            setError("OTP must be exactly 6 digits.");
            return;
        }

        // Map to backend expected keys
        const payload = {
            aadhaarNumber: formData["ctl00$ContentPlaceHolder1$txtadharno"] || "",
            entrepreneurName: formData["ctl00$ContentPlaceHolder1$txtownername"] || "",
            aadhaarConsent:
                formData["ctl00$ContentPlaceHolder1$chkDecarationA"] || false,
            otpCode: otp,
        };

        const res = await submitStep1(payload);
        if (res?.success && res?.submissionId) {
            onSuccess(res.submissionId);
        }
    };

    return (
        <div className="border rounded shadow">
            <div className="bg-[#007bff] text-white px-4 py-2 rounded-t font-semibold">
                Aadhaar Verification With OTP
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Error message */}
                {error && <div className="text-red-600 text-sm">{error}</div>}

                {/* Aadhaar and Name fields */}
                <div className="grid md:grid-cols-2 gap-4">
                    {fields
                        .filter(
                            (f) =>
                                f.fieldType === "text" &&
                                f.fieldName !== "ctl00$ContentPlaceHolder1$txtOtp1"
                        )
                        .map((f) => (
                            <div key={f.id}>
                                <label className="block font-semibold mb-1">{f.label}</label>
                                <input
                                    type={f.type || "text"}
                                    name={f.fieldName}
                                    placeholder={f.placeholder || ""}
                                    maxLength={f.maxLength || undefined}
                                    value={formData[f.fieldName] || ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                />
                            </div>
                        ))}
                </div>

                {/* Bullet Instructions */}
                <ul className="list-disc pl-12 text-sm space-y-1">
                    <li>Aadhaar number shall be required for Udyam Registration.</li>
                    <li>
                        The Aadhaar number shall be of the proprietor in the case of a
                        proprietorship firm, of the managing partner in the case of a
                        partnership firm and of a karta in the case of a Hindu Undivided
                        Family (HUF).
                    </li>
                    <li>
                        In case of a Company or a Limited Liability Partnership or a Cooperative Society or a Society or a Trust, the organisation or its authorised signatory shall provide its GSTIN(As per applicablity of CGST Act 2017 and as notified by the ministry of MSME vide S.O. 1055(E) dated 05th March 2021) and PAN along with its Aadhaar number.
                    </li>
                </ul>

                {/* Consent checkbox */}
                {fields
                    .filter((f) => f.fieldType === "checkbox")
                    .map((f) => (
                        <div key={f.id} className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                name={f.fieldName}
                                checked={!!formData[f.fieldName]}
                                onChange={handleChange}
                                className="mt-1"
                            />
                            <label className="text-sm">
                                I, the holder of the above Aadhaar, hereby give my consent to Ministry of MSME, Government of India, for using my Aadhaar number as alloted by UIDAI for Udyam Registration. NIC / Ministry of MSME, Government of India, have informed me that my aadhaar data will not be stored/shared. / मैं, आधार धारक, इस प्रकार उद्यम पंजीकरण के लिए यूआईडीएआई के साथ अपने आधार संख्या का उपयोग करने के लिए सू0ल0म0उ0 मंत्रालय, भारत सरकार को अपनी सहमति देता हूं। एनआईसी / सू0ल0म0उ0 मंत्रालय, भारत सरकार ने मुझे सूचित किया है कि मेरा आधार डेटा संग्रहीत / साझा नहीं किया जाएगा।
                            </label>
                        </div>
                    ))}

                {/* OTP field (only if showOtp true) */}
                {showOtp && (
                    <div>
                        <label className="block font-semibold mb-1">
                            *Enter One Time Password (OTP) Code
                        </label>
                        <input
                            type="text"
                            name="ctl00$ContentPlaceHolder1$txtOtp1"
                            placeholder="OTP code"
                            maxLength={6}
                            value={formData["ctl00$ContentPlaceHolder1$txtOtp1"] || ""}
                            onChange={handleChange}
                            className="border border-gray-300 rounded w-full px-3 py-2"
                        />
                    </div>
                )}

                {/* Button */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showOtp ? "Validate OTP" : "Validate & Generate OTP"}
                </button>
            </form>
        </div>
    );
}
