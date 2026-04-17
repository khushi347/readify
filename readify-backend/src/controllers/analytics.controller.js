import mongoose from "mongoose";
import UserBook from "../models/userBook.js";

export const getReadingAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // 📊 Total books
    const totalBooks = await UserBook.countDocuments({
      user: userId,
    });

    // 📊 Completed books
    const completedBooks = await UserBook.countDocuments({
      user: userId,
      status: "completed",
    });

    // 📊 Completion rate
    const completionRate =
      totalBooks === 0
        ? 0
        : Number(((completedBooks / totalBooks) * 100).toFixed(2));

    // 📊 Books this month
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const booksThisMonth = await UserBook.countDocuments({
      user: userId,
      status: "completed",
      updatedAt: { $gte: startOfMonth },
    });

    // 📊 Books per month (BAR CHART)
    const booksPerMonthRaw = await UserBook.aggregate([
      {
        $match: {
          user: userId,
          status: "completed",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const booksPerMonth = booksPerMonthRaw.map(item => ({
      month: monthNames[item._id - 1],
      count: item.count,
    }));

    // 📊 Top Genres (PIE CHART)
    const topGenresRaw = await UserBook.aggregate([
      {
        $match: {
          user: userId,
          status: "completed",
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
    $unwind: "$bookDetails.genre", // 🔥 THIS IS THE KEY FIX
  },
      {
        $group: {
          _id: "$bookDetails.genre",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // 🔍 Debug (keep for now)
    console.log("TOP GENRES RAW:", topGenresRaw);

    const topGenres = topGenresRaw.map(item => ({
      genre: item._id,
      count: item.count,
    }));

    // 📊 Top Authors
    const topAuthorsRaw = await UserBook.aggregate([
      {
        $match: {
          user: userId,
          status: "completed",
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $group: {
          _id: "$bookDetails.author",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const topAuthors = topAuthorsRaw.map(item => ({
      author: item._id,
      count: item.count,
    }));

    // 📤 Response
    res.json({
      totalBooks,
      completedBooks,
      completionRate,
      booksThisMonth,
      booksPerMonth,
      topGenres,
      topAuthors,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};