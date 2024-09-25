/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [Input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState([]);

  const [updateDialog, setUpdateDialog] = useState({
    isOpen: false,
    index: null,
    title: "",
    description: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Handle input title change
  function handleChange(event) {
    setInput(event.target.value);
  }

  // Handle description change
  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  // Load notes from local storage on component mount
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(savedNotes);
  }, []);

  // Add a note to local storage
  function addNoteToLocalStorage(note) {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    savedNotes.push(note); // Push the note object (title + description)
    localStorage.setItem("notes", JSON.stringify(savedNotes));
  }

  // Add new note
  function addNote() {
    if (Input === "") {
      alert("Input must be filled");
      return;
    }
    const newNote = {
      title: Input,
      description: description,
    };
    setNotes((prev) => [...prev, newNote]); // Store the new note (object)
    addNoteToLocalStorage(newNote); // Save it to local storage
    setInput(""); // Clear title input
    setDescription(""); // Clear description input
  }

  // Clear all notes from local storage
  function clearLocalStorage() {
    localStorage.clear();
    setNotes([]); // Clear the state as well
  }

  function deleteNote(index) {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    savedNotes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(savedNotes));
    setNotes(savedNotes);
  }

  function openUpdateDialog(index, title, description) {
    setIsUpdating(true);
    setUpdateDialog({
      index: index,
      title: title,
      description: description,
    });
  }

  return (
    <div
      className="flex flex-col items-center justify-start  h-screen  w-full"
      style={{
        fontFamily: "Gochi Hand , cursive",
      }}
    >
      <h1 className=" text-[#13ffaa]">Gasser is Coding</h1>
      <div className="w-[30vw]">
        <input
          type="text"
          placeholder="Enter a note title..."
          onChange={handleChange}
          value={Input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addNote();
            }
          }}
          className="p-3 w-full focus:outline-none my-3 h-[45px] rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-300"
        />
        <textarea
          placeholder="Enter a description..."
          onChange={handleDescriptionChange}
          value={description}
          className="p-3 w-full focus:outline-none my-3 h-[100px] rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-300"
        ></textarea>
        <button
          onClick={addNote}
          className="w-full bg-blue-500 text-white h-[45px] rounded-lg hover:bg-blue-600 transition-all"
        >
          Add Note +
        </button>
      </div>

      <div className="mt-8 w-[80vw] flex flex-wrap gap-6 justify-center">
        {notes.map((note, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md w-[250px] h-auto border-t-4 border-blue-400 text-gray-700"
          >
            <h1 className="text-xl font-bold mb-2">{note.title}</h1>
            <p className="text-sm mb-4">{note.description}</p>
            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={() =>
                  openUpdateDialog(index, note.title, note.description)
                }
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={() => deleteNote(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isUpdating && (
        <UpdateDialog
          index={updateDialog.index}
          title={updateDialog.title}
          description={updateDialog.description}
          setUpdating={setIsUpdating}
          setAllNotes={setNotes}
        />
      )}

      {/* Optionally: Button to clear all notes */}
      <button
        onClick={clearLocalStorage}
        className="mt-4 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
      >
        Clear All Notes
      </button>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
export function UpdateDialog({
  index,
  title,
  description,
  setUpdating,
  setAllNotes,
}) {
  const [allData, setAllData] = useState({
    title: title,
    description: description,
  });

  function handleUpdate() {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    savedNotes[index].title = allData.title; // Use updated title
    savedNotes[index].description = allData.description; // Use updated description
    localStorage.setItem("notes", JSON.stringify(savedNotes));
    setUpdating(false); // Close the dialog after updating
    setAllNotes((prev) => {
      const updatedNotes = [...prev];
      updatedNotes[index] = {
        title: allData.title,
        description: allData.description,
      };
      return updatedNotes;
    });
  }

  function handleValuesChange(event) {
    const { name, value } = event.target;
    setAllData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
      <div
        className="bg-white p-6 w-[90%] max-w-lg rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dialog
      >
        <h1>{index}</h1>
        <h1 className="text-2xl font-bold mb-4 text-black">Update Note</h1>
        <input
          type="text"
          name="title"
          value={allData.title}
          onChange={handleValuesChange}
          placeholder="Enter note title"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          name="description"
          value={allData.description}
          onChange={handleValuesChange}
          placeholder="Enter note description"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 h-[100px] resize-none"
        ></textarea>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Update
          </button>
          <button
            onClick={() => setUpdating(false)} // Close dialog on Cancel click
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
