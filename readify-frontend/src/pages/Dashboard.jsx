import { useEffect, useState } from "react";
import API from "../api/axios";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/analytics/reading");
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAnalytics();
  }, []);

  if (!data) return <p>Loading..</p>;

  

  return (
    <div className="p-6">
      <h1>Dashboard</h1>

      {/* Stats */}
      <div>
        <p>Total: {data.totalBooks}</p>
        <p>Completed: {data.completedBooks}</p>
        <p>Rate: {data.completionRate}%</p>
      </div>

      {/* Charts */}
      <div>
        <BarChart width={400} height={250} data={data.booksPerMonth}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>

        <PieChart width={300} height={300}>
          <Pie
            data={data.topGenres}
            dataKey="count"
            nameKey="genre"
            outerRadius={100}
          >
            {data.topGenres.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default Dashboard;