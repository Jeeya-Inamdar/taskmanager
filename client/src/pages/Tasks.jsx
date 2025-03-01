import React, { useState, useEffect } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]); // Define tasks state
  const [isLoading, setIsLoading] = useState(true); // Define loading state
  const [error, setError] = useState(null);

  const status = params?.status || "";

  const TASK_URL = "http://localhost:8080/api/task";

  const fetchTasks = async ({
    strQuery = "",
    isTrashed = false,
    search = "",
  }) => {
    setIsLoading(true);
    setError(null); // Reset error state before fetching

    try {
      const response = await fetch(
        `${TASK_URL}?stage=${encodeURIComponent(
          strQuery
        )}&isTrashed=${isTrashed}&search=${encodeURIComponent(search)}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Fetched tasks:", data);
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks({ strQuery: status, isTrashed: "", search: "" });
  }, [status]);

  return (
    <div className="w-full">
      {error && (
        <div className="text-red-500">Failed to load tasks: {error}</div>
      )}
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      {isLoading ? (
        <div className="py-10">
          <Loading />
        </div>
      ) : (
        <Tabs tabs={TABS} setSelected={setSelected}>
          {!status && (
            <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
              <TaskTitle label="To Do" className={TASK_TYPE.todo} />
              <TaskTitle
                label="In Progress"
                className={TASK_TYPE["in progress"]}
              />
              <TaskTitle label="Completed" className={TASK_TYPE.completed} />
            </div>
          )}

          {selected !== 1 ? (
            <BoardView tasks={tasks} />
          ) : (
            <div className="w-full">
              <Table tasks={tasks} />
            </div>
          )}
        </Tabs>
      )}
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
