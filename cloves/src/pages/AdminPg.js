import React, { useState } from "react";
import ModelManagement from "../Components/ModelManagement";

const models = [
  "renter",
  "clove_farmer",
  "clove_firm",
  "cloves",
  "payment",
  "purchase",
  "board",
  "officer",
];

const AdminPg = () => {
  const [selectedModel, setSelectedModel] = useState("renter");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="flex gap-2 flex-wrap mb-6">
        {models.map((model) => (
          <button
            key={model}
            onClick={() => setSelectedModel(model)}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            {model.replace("_", " ")}
          </button>
        ))}
      </div>
      <ModelManagement model={selectedModel} />
    </div>
  );
};

export default AdminPg;
