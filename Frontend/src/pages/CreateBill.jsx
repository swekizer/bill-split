import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";

function CreateBill() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null); // File object
  const [previewUrl, setPreviewUrl] = useState(null); // String URL for local preview
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(""); // Describe active process
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { getAuthHeader, API_URL } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
      // Auto-populate title if empty, e.g., "Bill - Jun 22, 2026"
      if (!title) {
        const dateStr = new Date().toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        setTitle(`Bill - ${dateStr}`);
      }
    }
  };

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a title for the bill.");
      return;
    }
    if (!image) {
      setError("Please select or drop a receipt image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Upload image to Supabase
      setLoadingStep("Uploading receipt image...");
      const fileName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from("bills")
        .upload(fileName, image);

      if (uploadError) {
        throw new Error("Image upload failed: " + uploadError.message);
      }

      // Step 2: Get public URL
      setLoadingStep("Retrieving file link...");
      const { data: urlData } = supabase.storage
        .from("bills")
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // Step 3: Call Spring Boot /create
      setLoadingStep("AI is reading and parsing your receipt... Please wait.");
      
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          title: title.trim(),
          billImage: imageUrl,
          generatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Backend processing failed.");
      }

      const bill = await response.json();
      console.log("Bill created successfully:", bill);
      
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "An unexpected error occurred during creation.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center p-gutter relative font-sans">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl float-anim"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl float-anim" style={{ animationDelay: "-2s" }}></div>
      </div>

      <main className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-surface-container-high relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/95 rounded-[2rem] z-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <span className="material-symbols-outlined text-5xl text-primary animate-spin mb-6">progress_activity</span>
            <h3 className="font-display font-bold text-2xl text-on-background mb-2">Analyzing Receipt</h3>
            <p className="text-on-surface-variant font-medium max-w-md">{loadingStep}</p>
          </div>
        )}

        {/* Back navigation */}
        <button 
          className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors mb-6 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="text-sm font-semibold">Back to Dashboard</span>
        </button>

        <div className="mb-8">
          <h2 className="font-display font-bold text-3xl text-on-background mb-2">Scan New Receipt</h2>
          <p className="text-on-surface-variant text-sm">Upload a photo of your bill, and our AI will extract the items and prices automatically.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container/20 border border-error/20 text-error text-sm rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-stack-sm">
            <label className="font-display text-label-md text-on-background block ml-1">Bill Title</label>
            <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-3 input-focus-effect border border-transparent transition-all">
              <span className="material-symbols-outlined text-outline mr-3">edit_note</span>
              <input 
                className="bg-transparent border-none focus:ring-0 w-full text-body-md placeholder:text-outline-variant outline-none" 
                placeholder="Dinner at Foo Bar, Grocery Run, etc." 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-stack-sm">
            <label className="font-display text-label-md text-on-background block ml-1">Receipt Image</label>
            
            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-outline-variant/50 rounded-2xl cursor-pointer bg-surface-container-low hover:bg-surface-container-low/80 hover:border-primary transition-all p-6 text-center">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="material-symbols-outlined text-4xl text-outline mb-3">upload_file</span>
                  <p className="text-body-md font-semibold text-on-surface mb-1">Click to upload photo</p>
                  <p className="text-xs text-on-surface-variant">PNG, JPG or JPEG (max 10MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  required
                />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-surface-container-high h-64 shadow-md bg-slate-50 group">
                <img className="w-full h-full object-contain" src={previewUrl} alt="Receipt preview" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                  <label className="bg-white hover:bg-slate-100 text-slate-900 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95">
                    <span className="material-symbols-outlined text-[18px]">cached</span>
                    <span>Change Image</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary/95 text-white font-display font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-8"
          >
            <span className="material-symbols-outlined">auto_awesome</span>
            <span>Scan Receipt</span>
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateBill;