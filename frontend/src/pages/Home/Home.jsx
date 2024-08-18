import React, { useEffect, useState } from "react";
import NoteCard from "../../components/Cards/EmpCard";
import { MdAdd, MdCreate, MdDelete } from "react-icons/md";
import Modal from "react-modal";
import AddEditNotes from "./AddEditEmp";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

const Home = () => {
  const { currentUser, loading, errorDispatch } = useSelector(
    (state) => state.user
  );

  const [userInfo, setUserInfo] = useState(null);
  const [allEmp, setAllEmp] = useState([]);

  const [isSearch, setIsSearch] = useState(false);

  // console.log(allNotes)

  const navigate = useNavigate();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    if (currentUser === null || !currentUser) {
      navigate("/login");
    } else {
      setUserInfo(currentUser?.rest);
      getAllNotes();
    }
  }, []);

  // get all function
  const getAllNotes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/emp/all", {
        withCredentials: true,
      });

      if (res.data.success === false) {
        console.log(res.data);
        return;
      }

      // console.log(res.data)

      setAllEmp(res.data.notes);
    } catch (error) {
      console.log(error);
    }
  };
  // edit function
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  // Delete controller
  const deleteNote = async (data) => {
    const empId = data._id;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/emp/delete/${empId}`,
        { withCredentials: true }
      );

      const { success, message } = response.data;

      if (!success) {
        toast.error(message || "Failed to delete the note.");
        return;
      }

      toast.success(message || "Note deleted successfully.");
      getAllNotes();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred."
      );
    }
  };
  // search controller
  const onSearchNote = async (query) => {
    try {
      const res = await axios.get("http://localhost:3000/api/emp/search", {
        params: { query },
        withCredentials: true, // Ensure this is needed for your case
      });

      // Check if response is successful and data contains notes
      if (res.data.success === false) {
        console.error(res.data.message); // Use console.error for errors
        toast.error(res.data.message);
        return;
      }

      setIsSearch(true);
      setAllEmp(res.data.notes || []); // Handle cases where notes might be undefined
    } catch (error) {
      // Provide a more user-friendly error message
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
  };

  // clear search
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Mobile</th>
                <th className="px-4 py-2 text-left">Gender</th>
                <th className="px-4 py-2 text-left">Designation</th>
                <th className="px-4 py-2 text-left">Course</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {allEmp.length > 0 ? (
                allEmp.map((emp, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{emp.name}</td>
                    <td className="px-4 py-2">{emp.email}</td>
                    <td className="px-4 py-2">{emp.mobile}</td>
                    <td className="px-4 py-2">{emp.gender}</td>
                    <td className="px-4 py-2">{emp.designation}</td>
                    <td className="px-4 py-2">{emp.course.join(", ")}</td>
                    <td className="px-4 py-2 text-sm text-green-700">
                      {moment(emp.createdAt).format("Do MMM YYYY")}
                    </td>
                    <td className="px-4 py-2 flex space-x-2">
                      <MdCreate
                        className="text-green-600 cursor-pointer hover:text-green-800"
                        onClick={() => handleEdit(notes)}
                      />
                      <MdDelete
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => deleteNote(notes)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">
                    <EmptyCard
                      imgSrc={
                        isSearch
                          ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtakcQoMFXwFwnlochk9fQSBkNYkO5rSyY9A&s"
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDCtZLuixBFGTqGKdWGLaSKiO3qyhW782aZA&s"
                      }
                      message={
                        isSearch
                          ? "Oops! No Notes found matching your search"
                          : `Ready to capture your ideas? Click the 'Add' button to start noting down your thoughts, inspiration, and reminders. Let's get started!`
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#2B85FF] hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-md:w-[60%] max-sm:w-[70%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          noteData={openAddEditModal.data}
          type={openAddEditModal.type}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;
