import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import { Board } from "../../data/board";
import { Columns } from "../../types";
import { onDragEnd } from "../../helpers/onDragEnd";
import { AddOutline } from "react-ionicons";
import AddModal from "../../components/Modals/AddModal";
import Task from "../../components/Task";
import Navbar from "../../components/Navbar";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const [columns, setColumns] = useState<Columns>(Board);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("toDo");
  const [searchQuery, setSearchQuery] = useState("");

  const openModal = () => {
    setSelectedColumn("backlog"); // Set to 'To Do' (backlog) for task creation
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddTask = (taskData: any) => {
    const newBoard = { ...columns };
    const newTask = {
      id: uuidv4(),
      ...taskData,
    };
    newBoard[selectedColumn].items.push(newTask); // Add task to 'To Do' column
    setColumns(newBoard); // Update the columns state
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  return (
    <>
      <Navbar onSearch={handleSearch} /> {/* Pass onSearch callback to Navbar */}

      <DragDropContext
        onDragEnd={(result: any) => onDragEnd(result, columns, setColumns)}
      >
        <div className="w-full flex items-start justify-center px-5 pb-8 gap-5">
          {Object.entries(columns)
            .filter(([columnId, column]: any) => 
              column.items.some(
                (task: any) =>
                  task.title.toLowerCase().includes(searchQuery) ||
                  task.description.toLowerCase().includes(searchQuery)
              )
            )
            .map(([columnId, column]: any) => (
              <div className="flex flex-col gap-0" key={columnId}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided: any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex flex-col md:w-[290px] w-[250px] gap-3 items-center py-5"
                    >
                      <div className="flex items-center justify-center py-[10px] w-full bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]">
                        {column.name}
                      </div>
                      {/* Filter tasks based on the search query */}
                      {column.items
                        .filter(
                          (task: any) =>
                            task.title.toLowerCase().includes(searchQuery) ||
                            task.description.toLowerCase().includes(searchQuery)
                        )
                        .map((task: any, index: any) => (
                          <Draggable
                            key={task.id.toString()}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided: any) => (
                              <Task provided={provided} task={task} />
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
        </div>
      </DragDropContext>

      <AddModal
        isOpen={modalOpen}
        onClose={closeModal}
        setOpen={setModalOpen}
        handleAddTask={handleAddTask}
      />

      {/* Floating Button to Open Add Task Modal */}
      <button
        onClick={openModal}
        className="fixed bottom-10 right-10 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        <AddOutline color={"#fff"} />
      </button>
    </>
  );
};

export default Home;

