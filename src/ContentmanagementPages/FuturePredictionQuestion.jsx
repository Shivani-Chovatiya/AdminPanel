import React, { useState } from "react";

const FuturePredictionQuestion = () => {
  const [type, setType] = useState("1 Credits");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ question: "", credits: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Question Added:", formData);
    setFormData({ question: "", credits: "" });
    setIsModalOpen(false);
  };

  const renderContent = () => {
    let title = "";
    let description = "";

    switch (type) {
      case "1 Credits":
        title = "1 Credit Prediction Question";
        description =
          "Manage and curate low-cost future prediction prompts. These templates are optimized for high-volume, standard accuracy predictions.";
        break;
      case "2 Credits":
        title = "2 Credit Prediction Question";
        description =
          "Manage high-complexity prediction models for premium questions. 2-credit templates include extended data points and multi-variant analysis features.";
        break;
      case "3 Credits":
        title = "3 Credit Prediction Question";
        description =
          "Manage high-fidelity predictive modeling templates. These questions require triple credit validation for maximum accuracy and data depth.";
        break;
      default:
        break;
    }

    return (
      <div className="flex flex-col md:flex-row justify-center md:justify-between gap-5 p-2 md:p-6">
        <div>
          <h1 className="text-black font-bold text-xl">{title}</h1>
          <p className="text-gray-400 text-xs md:w-1/2">{description}</p>
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary rounded-2xl px-4 py-2 w-1/2 md:w-full text-white text-xs md:text-sm"
          >
            + Add New Question
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-orange-100 px-4 sm:px-6">
        {["1 Credits", "2 Credits", "3 Credits"].map((tab) => (
          <button
            key={tab}
            onClick={() => setType(tab)}
            className={`py-2 px-3 text-xs font-semibold m-1 border border-primary rounded-xl ${
              type === tab ? "bg-primary text-white" : "text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/3 p-6">
            <h2 className="text-lg font-bold mb-4">Add New Question</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="question"
                placeholder="Enter Question"
                value={formData.question}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-md"
                required
              />
              <input
                type="number"
                name="credits"
                placeholder="Enter Credits"
                value={formData.credits}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-md"
                min={1}
                required
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary px-4 py-2 rounded-md text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuturePredictionQuestion;
