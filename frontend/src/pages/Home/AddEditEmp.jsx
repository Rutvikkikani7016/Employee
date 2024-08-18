import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "../../components/Input/TagInput ";
import axios from "axios";
import { toast } from "react-toastify";

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
  const [error, setError] = useState(null);
  const [name, setName] = useState(noteData?.name || "");
  const [email, setEmail] = useState(noteData?.email || "");
  const [mobile, setMobile] = useState(noteData?.mobile || "");
  const [designation, setDesignation] = useState(noteData?.designation || "");
  const [gender, setGender] = useState(noteData?.gender || "");
  const [course, setCourse] = useState(noteData?.course || []);

  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  //   Edit Note
  const editNote = async () => {
    const empId = noteData._id;
    console.log(empId);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/emp/edit/" + empId,
        { name, email, mobile, designation, gender, course },
        { withCredentials: true }
      );

      console.log(res.data);

      if (res.data.success === false) {
        console.log(res.data.message);
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
      setError(error.message);
    }
  };

  //   Add Note
  const addNewNote = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/emp/add",
        { name, email, mobile, designation, course, gender },
        { withCredentials: true }
      );
      console.log(res);

      if (!res.data.success) {
        // Handle server-side validation error
        console.log(res.data.message);
        setError(res.data.message);
        toast.error(res.data.message);

        return;
      }

      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
      setError(error.message);
    }
  };

  const handleSvg = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleAddNote = () => {
    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (selectedCourse) => {
    if (course.includes(selectedCourse)) {
      // Remove the course if it's already selected
      setCourse(course.filter((c) => c !== selectedCourse));
    } else {
      // Add the course if it's not already selected
      setCourse([...course, selectedCourse]);
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      {/* name */}
      <div className="flex flex-col gap-2">
        <label className="input-label text-red-400 uppercase">Name</label>

        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Name"
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </div>
      {/* email */}
      <div className="flex flex-col gap-2">
        <label className="input-label text-red-400 uppercase">email</label>

        <input
          type="email"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
        />
      </div>
      {/* mobile */}
      <div className="flex flex-col gap-2">
        <label className="input-label text-red-400 uppercase">mobile</label>

        <input
          type="number"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Mobile"
          value={mobile}
          onChange={({ target }) => setMobile(target.value)}
        />
      </div>
      {/* gender */}
      <div className="flex flex-col gap-2">
        <label className="input-label text-red-400 uppercase">Gender</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="Male"
              className="mr-2"
              checked={gender === "Male"}
              onChange={({ target }) => setGender(target.value)}
            />
            Male
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="Female"
              className="mr-2"
              checked={gender === "Female"}
              onChange={({ target }) => setGender(target.value)}
            />
            Female
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="Other"
              className="mr-2"
              checked={gender === "Other"}
              onChange={({ target }) => setGender(target.value)}
            />
            Other
          </label>
        </div>
      </div>
      {/* course */}
      <div className="flex flex-col gap-2">
        <label className="input-label text-red-400 uppercase">Course</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              value="BCA"
              checked={course.includes("BCA")}
              onChange={() => handleCheckboxChange("BCA")}
              className="mr-2"
            />
            BCA
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="MCA"
              checked={course.includes("MCA")}
              onChange={() => handleCheckboxChange("MCA")}
              className="mr-2"
            />
            MCA
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="MSC"
              checked={course.includes("MSC")}
              onChange={() => handleCheckboxChange("MSC")}
              className="mr-2"
            />
            Other
          </label>
        </div>
      </div>
      {/* degignation */}
      <div className="flex flex-col gap-2">
        <label className="input-label text-red-400 uppercase">
          -- Designation --
        </label>
        <select
          className="text-xl text-slate-950 outline-none bg-white border border-gray-300 rounded-md"
          value={designation}
          onChange={({ target }) => setDesignation(target.value)}
        >
          <option
            value=""
            className="text-2xl text-slate-950 outline-none"
            disabled
          >
            Select your designation
          </option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Manager">Seals</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
