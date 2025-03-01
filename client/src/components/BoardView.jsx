import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { useGetAllTasksQuery } from "../redux/slices/api/taskApiSlice";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  "to-do": "bg-blue-600",
  "in-progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  const stage = params?.stage || "";

  const { data, isLoading } = useGetAllTasksQuery({
    strQuery: stage,
    isTrashed: false,
    search: "",
  });

  // Filter tasks based on the selected stage
  const filteredTasks =
    data?.tasks?.filter((task) => (stage ? task.stage === stage : true)) || [];

  const handleStageClick = (stage) => {
    navigate(`/tasks/${stage}`);
  };

  return isLoading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={stage ? `${stage} Tasks` : "Tasks"} />

        {!stage && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {/* Stage filters */}
        <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
          <TaskTitle
            label="To Do"
            className={TASK_TYPE["to-do"]}
            onClick={() => handleStageClick("to-do")}
          />
          <TaskTitle
            label="In Progress"
            className={TASK_TYPE["in-progress"]}
            onClick={() => handleStageClick("in-progress")}
          />
          <TaskTitle
            label="Completed"
            className={TASK_TYPE.completed}
            onClick={() => handleStageClick("completed")}
          />
        </div>

        {selected !== 1 ? (
          <BoardView tasks={filteredTasks ?? []} />
        ) : (
          <div className="w-full">
            <Table tasks={filteredTasks ?? []} />
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
