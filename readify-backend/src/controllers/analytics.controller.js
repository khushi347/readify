import UserBook from "../models/userBook.js";
const getReadingAnalytics = async (req, res) => {
  try {
    const totalBooks = await UserBook.countDocuments({
      user: req.user._id,
    });

    const completedBooks = await UserBook.countDocuments({
      user: req.user._id,
      status: "completed",
    });

    const completionRate =
      totalBooks === 0
        ? 0
        : Number(((completedBooks / totalBooks) * 100).toFixed(2));

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const booksThisMonth = await UserBook.countDocuments({
      user: req.user._id,
      status: "completed",
      updatedAt: { $gte: startOfMonth },
    });

    res.json({
      totalBooks,
      completedBooks,
      completionRate,
      booksThisMonth,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {getReadingAnalytics};