import React, { useEffect, useState } from "react";
import "./activitylog.css"; // import the stylesheet
import { useBoardStore } from "../../stores/useBoardStore";
import { useAuthStore } from "../../stores/useAuthStore";

const ActivityLog = () => {
  const { logs, totalLogs, fetchLogs } = useBoardStore();
  const {socket}=useAuthStore()
  const [displayedLogs, setDisplayedLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can adjust this value
  const [totalPages, setTotalPages] = useState(
    Math.ceil(totalLogs.length / itemsPerPage)
  );

  const handleFetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      await fetchLogs(); // no need to send page, limit anymore
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchLogs(1);
  }, [socket]);

  useEffect(() => {
    setTotalPages(Math.ceil(logs.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedLogs(logs.slice(startIndex, endIndex));
  }, [logs, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      handleFetchLogs(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn pagination-nav"
      >
        ← Previous
      </button>
    );

    // First page and ellipsis
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn pagination-nav"
      >
        Next →
      </button>
    );

    return buttons;
  };

  return (
    <section className="log-wrapper">
      <div className="log-header">
        <h2 className="log-title">Activity Log</h2>
        <div className="log-info">
          {!loading && logs.length > 0 && (
            <span className="log-count">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalLogs)} of {totalLogs}{" "}
              entries
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="log-loading">
          <div className="loading-spinner"></div>
          <p>Loading activity logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="log-empty">
          <p>No recent activity found.</p>
        </div>
      ) : (
        <>
          <ul className="log-list">
            {displayedLogs.map((log) => (
              <li key={`${log._id}-${currentPage}`} className="log-item">
                <span className={`log-badge badge-${log.action}`}>
                  {log.action}
                </span>
                <div className="log-body">
                  <p className="log-details">{log.details || "—"}</p>
                  <span className="log-meta">
                    by {log.user.fullName} •{" "}
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination">{renderPaginationButtons()}</div>
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ActivityLog;
