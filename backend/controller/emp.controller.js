import Emp from "../models/emp.model.js";
import { errorHandler } from "../utils/error.js";

// add user
export const addemp = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { name, email, mobile, designation, gender, course } = req.body;

    // Validate required fields
    if (!name) {
      return next(errorHandler(400, "Name is required"));
    }
    if (!email) {
      return next(errorHandler(400, "Email is required"));
    }
    if (!mobile) {
      return next(errorHandler(400, "Mobile is required"));
    }

    // Validate the mobile number format
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return next(errorHandler(400, "Mobile number must be a 10-digit number"));
    }

    if (!designation) {
      return next(errorHandler(400, "Designation is required"));
    }
    if (!gender) {
      return next(errorHandler(400, "Gender is required"));
    }
    if (!course) {
      return next(errorHandler(400, "Course is required"));
    }

    // Check if an employee with the same email or mobile number already exists
    const existingEmp = await Emp.findOne({ $or: [{ email }, { mobile }] });

    if (existingEmp) {
      return res.status(400).json({
        success: false,
        message: "Employee with the same email or mobile number already exists",
      });
    }

    // Create a new employee record
    const employee = new Emp({
      name,
      gender,
      course: course || [],
      email,
      mobile,
      designation,
      empId: id,
    });

    // Save the new employee to the database
    await employee.save();

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee,
    });
  } catch (error) {
    next(error);
  }
};


// edit searchemployee
export const editemp = async (req, res, next) => {
  const emp = await Emp.findById(req.params.empId);

  if (!emp) {
    return next(errorHandler(404, "Note not found"));
  }
  if (req.user.id !== emp.empId) {
    return next(errorHandler(401, "You can only update your own note!"));
  }
  const { name, email, gender, designation, course, mobile } = req.body;

  if (!name && !email && !gender && !designation && !course && !mobile) {
    return next(errorHandler(404, "No changes provided"));
  }

  try {
    // Check if the email being updated is already in use by another employee
    if (email && email !== emp.email) {
      const existingEmpWithEmail = await Emp.findOne({ email });

      if (existingEmpWithEmail) {
        return next(
          errorHandler(400, "Email is already in use by another employee")
        );
      }

      emp.email = email;
    }
    if (name) {
      emp.name = name;
    }
    if (gender) {
      emp.gender = gender;
    }
    if (designation) {
      emp.designation = designation;
    }
    if (course) {
      emp.course = course;
    }
    if (mobile) {
      emp.mobile = mobile;
    }

    await emp.save();

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};
// export const editemp = async (req, res, next) => {
//   const note = await Emp.findById(req.params.empId);

//   if (!note) {
//     return next(errorHandler(404, "Note not found"));
//   }
//   if (req.user.id !== emp.empId) {
//     return next(errorHandler(401, "You can only update your own note!"));
//   }
//   const { name, email, gender, designation, course, mobile } = req.body;

//   if (!name && !email && !gender && !designation && !course && !mobile) {
//     return next(errorHandler(404, "No changes provided"));
//   }

//   try {
//     // Check if the email being updated is already in use by another employee
//     if (email && email !== emp.email) {
//       const existingEmpWithEmail = await Emp.findOne({ email });

//       if (existingEmpWithEmail) {
//         return next(
//           errorHandler(400, "Email is already in use by another employee")
//         );
//       }

//       emp.email = email;
//     }
//     if (name) {
//       emp.name = name;
//     }
//     if (gender) {
//       emp.gender = gender;
//     }
//     if (designation) {
//       emp.designation = designation;
//     }
//     if (course) {
//       emp.course = course;
//     }
//     if (mobile) {
//       emp.mobile = mobile;
//     }

//     await emp.save();

//     res.status(200).json({
//       success: true,
//       message: "Employee updated successfully",
//       note,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// get all user
export const getallemp = async (req, res, next) => {
  const empId = req.user.id;

  try {
    const notes = await Emp.find({ empId: empId });

    res.status(200).json({
      success: true,
      message: "All Employee retrived successfully",
      notes,
    });
  } catch (error) {
    next(error);
  }
};
// delete user
export const deleteemp = async (req, res, next) => {
  const empId = req.params.empId;

  try {
    // Find the note to ensure it exists and belongs to the user
    const emp = await Emp.findOne({ _id: empId, empId: req.user.id });

    if (!emp) {
      return next(errorHandler(404, "Note not found"));
    }

    // Delete the note
    await Emp.deleteOne({ _id: empId, empId: req.user.id });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    // Handle errors
    return next(errorHandler(500, "Failed to delete note")); // Use a custom error handler with a 500 status code
  }
};
// searchemployee constroller
export const searchemployee = async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(errorHandler(400, "Search query is required"));
  }

  try {
    const matchingNotes = await Emp.find({
      empId: req.user.id,
      $or: [
        { email: { $regex: new RegExp(query, "i") } },
        { name: { $regex: new RegExp(query, "i") } },
        { number: { $regex: new RegExp(query, "i") } },
        { designation: { $regex: new RegExp(query, "i") } },
        { course: { $regex: new RegExp(query, "i") } },
        { gender: { $regex: new RegExp(query, "i") } },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Employee matching the search query retrieved successfully",
      notes: matchingNotes,
    });
  } catch (error) {
    next(error);
  }
};
