export const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "Not set";