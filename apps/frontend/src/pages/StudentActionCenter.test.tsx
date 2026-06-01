import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "../test/server";
import { StudentActionCenter } from "./StudentActionCenter";

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <StudentActionCenter studentId="stu_001" />
    </QueryClientProvider>,
  );
}

describe("StudentActionCenter", () => {
  it("shows a loading state then renders the student profile", async () => {
    renderPage();

    expect(screen.getByTestId("loading-state")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("Maya Patel")).toBeInTheDocument(),
    );
    expect(screen.getByTestId("urgency-badge")).toHaveAttribute(
      "data-urgency",
      "high",
    );
    expect(screen.getByTestId("unread-count")).toHaveTextContent("2 unread");
  });

  it("shows an error state when the request fails", async () => {
    server.use(
      http.get("http://localhost:4000/students/:id/action-center", () =>
        HttpResponse.json({ error: "BOOM", message: "boom" }, { status: 500 }),
      ),
    );

    renderPage();

    await waitFor(() =>
      expect(screen.getByTestId("error-state")).toBeInTheDocument(),
    );
  });
});
