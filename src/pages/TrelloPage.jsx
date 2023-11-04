import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import initialData from '../assets/trelloData';
import Column from '../components/column/Column';
import { styled } from 'styled-components';
import styles from './trello.module.scss';
import { XCircle } from 'lucide-react';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const NewColumnBtn = styled.div`
  border: 1px solid red;
  height: fit-content;
`;

const TrelloPage = () => {
  const [data, setData] = useState(initialData);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');
  const columnCreateInputRef = useRef(null);

  useEffect(() => {
    if (isCreatingColumn) {
      columnCreateInputRef.current.focus();
    }
  }, [isCreatingColumn]);

  console.log('Column Title', columnTitle);

  const onDragStart = () => {
    document.body.style.color = 'orange';
    document.body.style.transition = 'background-color 0.2s ease';
  };

  const onDragUpdate = (update) => {
    const { destination } = update;
    const opacity = destination
      ? destination.index / Object.keys(data.tasks).length
      : 0;

    document.body.style.backgroundColor = `rgba(153, 141,  217, ${opacity})`;
  };

  const onDragEnd = (result) => {
    document.body.style.color = 'inherit';
    document.body.style.backgroundColor = 'inherit';
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...data,
        columnOrder: newColumnOrder,
      };

      setData(newState);
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    //Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    console.log(newState);
    setData(newState);
    return;
  };

  const addNewColumn = (columnTitle) => {
    console.log(data.columnOrder.length);
    const columnId = `column-${data.columnOrder.length + 1}`;
    const newColumnData = {
      ...data,
      columns: {
        ...data.columns,
        [columnId]: {
          id: columnId,
          title: columnTitle,
          taskIds: [],
        },
      },
      columnOrder: [...data.columnOrder, columnId],
    };

    setData(newColumnData);
    console.log(newColumnData);
  };

  const renameColumn = (columnId, newColumnTitle) => {
    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          title: newColumnTitle,
        },
      },
    };
    console.log('NEW DATA', newData);

    setData(newData);
  };

  const deleteColumn = (columnId) => {
    console.log(columnId);
    const updatedTasks = { ...data.tasks };
    const updatedColumns = { ...data.columns };
    const updatedColumnOrder = data.columnOrder.filter(
      (column) => column !== columnId
    );

    data.columns[columnId].taskIds.forEach((taskId) => {
      delete updatedTasks[taskId];
    });

    delete updatedColumns[columnId];

    setData({
      tasks: updatedTasks,
      columns: updatedColumns,
      columnOrder: updatedColumnOrder,
    });
  };

  const addTaskToColumn = (columnId, taskText) => {
    console.log(columnId, taskText);
    const taskId = `task-${Object.keys(data.tasks).length + 1}`;

    const newTask = {
      id: taskId,
      content: taskText,
    };

    const updatedTasks = { ...data.tasks };
    updatedTasks[taskId] = newTask;

    const updatedColumns = { ...data.columns };
    updatedColumns[columnId].taskIds.push(taskId);

    setData({
      ...data,
      tasks: updatedTasks,
      columns: updatedColumns,
    });
  };

  return (
    <div
      className="container"
      style={{ display: 'flex', justifyContent: 'flex-start' }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="allColumns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {data.columnOrder.map((columnId, index) => {
                const column = data.columns[columnId];
                const tasks = column.taskIds.map(
                  (taskId) => data.tasks[taskId]
                );

                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    index={index}
                    renameColumn={renameColumn}
                    deleteColumn={deleteColumn}
                    addTaskToColumn={addTaskToColumn}
                  />
                );
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>

      {isCreatingColumn ? (
        <div className={styles.cardCreatingWrapper}>
          <button
            className={styles.creatingCloseBtn}
            onClick={() => setIsCreatingColumn(false)}
          >
            <XCircle />
          </button>
          <input
            type="text"
            value={columnTitle}
            ref={columnCreateInputRef}
            onChange={(e) => setColumnTitle(e.target.value)}
            onBlur={() => {
              setIsCreatingColumn(false);
              setColumnTitle('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && columnTitle) {
                addNewColumn(columnTitle);
                setColumnTitle('');
                setIsCreatingColumn(false);
              }
            }}
          />
          <button
            className={styles.createColumnBtn}
            onClick={() => {
              addNewColumn(columnTitle);
              setIsCreatingColumn(false);
            }}
            disabled={!columnTitle}
          >
            Добавить список
          </button>
        </div>
      ) : (
        <button
          className={styles.addNewColumnBtn}
          onClick={() => setIsCreatingColumn(!isCreatingColumn)}
        >
          <span>+</span> Добавить еще одну колонку
        </button>
      )}
    </div>
  );
};

export default TrelloPage;
