import React, { useEffect, useState } from "react";
import { getFieldsByStep, submitStep2 } from "../api/api";

export default function Step2Form({ submissionId }) {
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getFieldsByStep(2).then((res) => {
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

        // Clear errors when user starts typing/selecting
        if (errors.length > 0) {
            setErrors([]);
        }
        // Clear success message when user makes changes
        if (success) {
            setSuccess(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors([]);
        setSuccess(false);

        const payload = {
            organizationType: formData["ctl00$ContentPlaceHolder1$ddlTypeofOrg"] || "",
            panNumber: formData["ctl00$ContentPlaceHolder1$txtPan"] || "",
            panHolderName: formData["ctl00$ContentPlaceHolder1$txtPanName"] || "",
            dobOrDoi: formData["ctl00$ContentPlaceHolder1$txtdob"] || "",
            panConsent: formData["ctl00$ContentPlaceHolder1$chkDecarationP"] || false,
        };

        try {
            const res = await submitStep2(submissionId, payload);
            console.log("Step 2 Response:", res);

            if (res.success) {
                setSuccess(true);
                setErrors([]);
            } else if (res.error && res.details) {
                setErrors(res.details);
                console.log(errors)
                setSuccess(false);
            }
        } catch (error) {

            setErrors([{ field: "general", message: error.response.data.details[0].message }]);
            setSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border rounded shadow">
            {/* Section Header */}
            <div className="bg-green-600 text-white px-4 py-2 rounded-t font-semibold">
                PAN Verification
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Success Message */}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">PAN Verified Successfully!</span>
                    </div>
                )}

                {/* Error Messages */}
                {errors.length > 0 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">Please fix the following errors:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                            {errors.map((error, index) => (
                                <li key={index} className="text-sm">
                                    {error.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Render Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                    {fields.map((f) => {
                        // Check if this field has an error
                        const fieldError = errors.find(err => err.field === f.fieldName);
                        const hasError = !!fieldError;

                        // Select dropdown
                        if (f.elementType === "select") {
                            return (
                                <div key={f.id}>
                                    <label className="block font-semibold mb-1">{f.label}</label>
                                    <select
                                        name={f.fieldName}
                                        value={formData[f.fieldName] || ""}
                                        onChange={handleChange}
                                        className={`border rounded w-full px-3 py-2 ${hasError
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-300'
                                            }`}
                                    >
                                        {f.options &&
                                            f.options.map((opt, idx) => (
                                                <option key={idx} value={opt.value}>
                                                    {opt.text}
                                                </option>
                                            ))}
                                    </select>
                                    {hasError && (
                                        <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
                                    )}
                                </div>
                            );
                        }

                        // Checkbox consent
                        if (f.fieldType === "checkbox") {
                            const checkboxError = errors.find(err => err.field === f.fieldName);
                            const hasCheckboxError = !!checkboxError;

                            return (
                                <div key={f.id} className="col-span-2">
                                    <div className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            name={f.fieldName}
                                            checked={!!formData[f.fieldName]}
                                            onChange={handleChange}
                                            className={`mt-1 ${hasCheckboxError ? 'border-red-500' : ''}`}
                                        />
                                        <label className={`text-sm ${hasCheckboxError ? 'text-red-700' : ''}`}>
                                            I, the holder of the above PAN, hereby give my consent to
                                            Ministry of MSME, Government of India, for using my data
                                            available in the GST Returns and other government databases...
                                        </label>
                                    </div>
                                    {hasCheckboxError && (
                                        <p className="text-red-500 text-sm mt-1 ml-6">{checkboxError.message}</p>
                                    )}
                                </div>
                            );
                        }

                        // Text input fields
                        if (f.elementType === "input" && f.type !== "submit") {
                            return (
                                <div key={f.id}>
                                    <label className="block font-semibold mb-1">{f.label}</label>
                                    <input
                                        type={f.type || "text"}
                                        name={f.fieldName}
                                        placeholder={f.placeholder || ""}
                                        maxLength={f.maxLength || undefined}
                                        value={formData[f.fieldName] || ""}
                                        onChange={handleChange}
                                        className={`border rounded w-full px-3 py-2 ${hasError
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-300'
                                            }`}
                                    />
                                    {hasError && (
                                        <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
                                    )}
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>

                {/* PAN Validate Button */}
                {fields
                    .filter((f) => f.fieldType === "button")
                    .map((btn) => (
                        <button
                            key={btn.id}
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 rounded transition-colors ${isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                                } text-white`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Validating...
                                </span>
                            ) : (
                                btn.label
                            )}
                        </button>
                    ))}
            </form>
        </div>
    );
}