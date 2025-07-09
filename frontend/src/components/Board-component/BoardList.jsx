import React, { useEffect, useRef, useState } from "react";
import "./boardlist.css";
import { useBoardStore } from "../../stores/useBoardStore";
import { useAuthStore } from "../../stores/useAuthStore";

export default function BoardList() {
  const {
    boards,
    selectedBoard,
    setSelectedBoard,
    setBoards,
    addMemebers,
    getBoards,
    updateBoard,
    getBoardWithId,
    setIsUpdatingBoardId,
    createBoard,
    isAddingBoard,
    isUpdatingBoardId,
    isDeletingBoard,
    deleteBoard,
  } = useBoardStore();
  const { fetchUsers, availableMembers ,authUser} = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedBoardForMembers, setSelectedBoardForMembers] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [editName, setEditName] = useState("");
  const [boardName, setBoardName] = useState("");

  const boardListRef = useRef();
  useEffect(() => {
    if (boardListRef.current) {
      boardListRef.current.scrollIntoView({ behavior: "smooth",block: "center"});
    }
  }, [selectedBoard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boardName) return;
    try {
      await createBoard({ name: boardName });
    } catch (error) {
      
    }
    setBoardName("");
    setShowModal(false);
  };

  const handleOptionsClick = (e, boardId) => {
    e.stopPropagation();
    setShowOptionsMenu(showOptionsMenu === boardId ? null : boardId);
  };

  const handleDelete = async (boardId) => {
    await deleteBoard(boardId);
    setSelectedBoard(null);
    setShowOptionsMenu(null);
  };

  const handleUpdateOption = (boardId, currentName) => {
    setIsUpdatingBoardId(boardId);
    setEditName(currentName);
    setShowOptionsMenu(null);
  };
  const handleUpdateBoard = async (event, boardId) => {
    event.preventDefault();
    if (!editName.trim()) return;
    await updateBoard({ name: editName }, boardId);
    setEditName("");
    setIsUpdatingBoardId(null);
  };

  const handleAddMembers = (board) => {
    // console.log("Boardss : ", board);
    setSelectedBoardForMembers(board);
    setShowMembersModal(true);
    setShowOptionsMenu(null);
    setSelectedMembers([]);
    setMemberSearch("");
  };

  const handleMemberToggle = (member) => {
    // console.log("Handle member toggle works ", member);
    setSelectedMembers((prev) =>
      prev.includes(member._id)
        ? prev.filter((id) => id !== member._id)
        : [...prev, member._id]
    );
  };

  const handleAddMemberRequest = async () => {
    if (selectedMembers.length > 0 && selectedBoardForMembers) {
      try {
        await addMemebers(selectedMembers, selectedBoardForMembers._id);
        setShowMembersModal(false);
        setSelectedMembers([]);
        setSelectedBoardForMembers(null);
      } catch (error) {
        console.error("Error adding members:", error);
        // Handle error (could show toast notification)
      }
    }
  };

  useEffect(() => {
    getBoards();
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".options-menu") &&
        !e.target.closest(".options-btn")
      ) {
        setShowOptionsMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMembers = availableMembers.filter(
  (member) =>
    member._id !== authUser._id && (
      member.fullName.toLowerCase().includes(memberSearch.toLowerCase()) ||
      member.email.toLowerCase().includes(memberSearch.toLowerCase())
    )
);


  return (
    <div className="left-boardlist-container">
      <div className="board-list">
        <div className="board-list-header">
          <h2 className="board-list__title">My Boards</h2>
          <div className="board-count">{boards.length} boards</div>
        </div>

        <div className="boards">
          {boards.map((board, index) => (
            <div
              key={board._id}
              className={`board-item ${
                selectedBoard?._id === board._id ? "active" : ""
              } ${showOptionsMenu === board._id ? "showing-options" : ""}`}
              onClick={() => {
                setSelectedBoard(board);
                setShowOptionsMenu(null);
              }}
              onDoubleClick={() => setSelectedBoard(null)}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="board-item-content">
                <div className="board-hover-indicator"></div>
                <div className="board-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="8"
                      height="8"
                      rx="2"
                      fill="currentColor"
                      opacity="0.6"
                    />
                    <rect
                      x="13"
                      y="3"
                      width="8"
                      height="8"
                      rx="2"
                      fill="currentColor"
                      opacity="0.8"
                    />
                    <rect
                      x="3"
                      y="13"
                      width="8"
                      height="8"
                      rx="2"
                      fill="currentColor"
                      opacity="0.7"
                    />
                    <rect
                      x="13"
                      y="13"
                      width="8"
                      height="8"
                      rx="2"
                      fill="currentColor"
                      opacity="0.5"
                    />
                  </svg>
                </div>

                {isUpdatingBoardId === board._id ? (
                  <form
                    onSubmit={(event) => handleUpdateBoard(event, board._id)}
                    className="edit-form"
                  >
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="edit-input"
                      placeholder="Edit board name"
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button type="submit" className="save-btn">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditName("");
                          setIsUpdatingBoardId(null);
                        }}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <span className="board-name">{board.name}</span>
                )}
                <div className="board-options">
                  <button
                    className="options-btn"
                    onClick={(e) => handleOptionsClick(e, board._id)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="1" fill="currentColor" />
                      <circle cx="12" cy="5" r="1" fill="currentColor" />
                      <circle cx="12" cy="19" r="1" fill="currentColor" />
                    </svg>
                  </button>

                  {showOptionsMenu === board._id && (
                    <div className="options-menu">
                      <button
                        className="option-item"
                        onClick={() =>
                          handleUpdateOption(board._id, board.name)
                        }
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Update
                      </button>
                      <button
                        className="option-item"
                        onClick={() => handleAddMembers(board)}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="9"
                            cy="7"
                            r="4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Add Members
                      </button>
                      <button
                        className="option-item delete"
                        onClick={() => handleDelete(board._id)}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <polyline
                            points="3,6 5,6 21,6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {isDeletingBoard ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {(selectedBoard?._id===board._id) && <div ref={boardListRef}></div>}
            </div>
          ))}

          {!boards.length && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="8"
                    height="8"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                  <rect
                    x="13"
                    y="3"
                    width="8"
                    height="8"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                  <rect
                    x="3"
                    y="13"
                    width="8"
                    height="8"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                  <rect
                    x="13"
                    y="13"
                    width="8"
                    height="8"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                </svg>
              </div>
              <p className="empty-text">No boards yet</p>
              <p className="empty-subtext">
                Create your first board to get started
              </p>
            </div>
          )}
        </div>

        <button className="add-board-btn" onClick={() => setShowModal(true)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>New Board</span>
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Board</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="board-name">Board Name</label>
                <input
                  id="board-name"
                  type="text"
                  placeholder="Enter board name..."
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="board-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingBoard}
                  className="create-btn"
                >
                  {isAddingBoard ? "Creating..." : "Create Board"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {showMembersModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowMembersModal(false)}
        >
          <div
            className="modal members-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Add Members to {selectedBoardForMembers.name}</h3>
              <button
                className="modal-close"
                onClick={() => setShowMembersModal(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="members-search">
              <input
                type="text"
                placeholder="Search members..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="members-list">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div
                    key={member._id}
                    className={`member-item ${
                      selectedMembers.includes(member._id) ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      if (e.target.type !== "checkbox") {
                        handleMemberToggle(member);
                      }
                    }}
                  >
                    <div className="member-avatar">
                      {member.profilePic ? (
                        <img src={member.profilePic} alt={member.fullName} />
                      ) : (
                        <div className="avatar-placeholder">
                          {member.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="member-info">
                      <div className="member-name">{member.fullName}</div>
                      <div className="member-email">{member.email}</div>
                    </div>
                    <div className="member-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member._id)}
                        onChange={() => handleMemberToggle(member)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-members">
                  <p>No members found</p>
                </div>
              )}
            </div>

            {selectedMembers.length > 0 && (
              <div className="selected-members-summary">
                <p>
                  {selectedMembers.length} member
                  {selectedMembers.length > 1 ? "s" : ""} selected
                </p>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-addmem-btn"
                onClick={() => setShowMembersModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="create-btn"
                onClick={handleAddMemberRequest}
                disabled={selectedMembers.length === 0}
              >
                Add to member ({selectedMembers.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
