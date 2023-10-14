import React from "react";
import Pagination from "./App";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

const PAGE_NUMBER_TEST_ID = "page-number";

const RenderPageNumbers = (itemsPerPage:number = 3) => {
  render(
    <Pagination
        totalItems={6}
        itemsPerPage={itemsPerPage}
        pageNumberTestId={PAGE_NUMBER_TEST_ID}
      />
  );
  const prevButton = screen.getByText(/previous/i);
  const nextButton = screen.getByText(/next/i);
  return {
    prevButton,nextButton
  };
}

describe("Pagination", () => {
  test("Pagination 컴포넌트 렌더링", () => {
    //arrange
    const {prevButton,nextButton} = RenderPageNumbers();
    const pageNumbers = screen.getAllByTestId(PAGE_NUMBER_TEST_ID);

    //assert
    pageNumbers.forEach((pageNumber, i) => {
      expect(pageNumber).toHaveTextContent(`${i + 1}`);
    });
    expect(prevButton).toHaveClass("disabled");
    expect(nextButton).not.toHaveClass("disabled");
  });

  test("첫번째 페이지에서는 이전 페이지로 돌아갈 수 없음", () => {
    // arrange
    const {prevButton} = RenderPageNumbers();
    // act    
    fireEvent.click(prevButton);
    // assert
    expect(prevButton).toHaveClass("disabled");
  });

  test("중간 페이지에서는 이전, 다음 페이지로 이동할 수 있음", () => {
    const {prevButton,nextButton} = RenderPageNumbers(2);
    fireEvent.click(nextButton);

    expect(prevButton).not.toHaveClass("disabled");
    expect(nextButton).not.toHaveClass("disabled");
  });

  test("마지막 페이지에서는 다음 버튼을 클릭했을 때 다음 페이지로 이동할 수 없음", () => {
    // arrange
    const {nextButton} = RenderPageNumbers();
    // act
    fireEvent.click(nextButton);
    // assert
    expect(nextButton).toHaveClass("disabled");
  });

  test("페이지 누르면 그 숫자로 이동",()=>{
    RenderPageNumbers();
    const pageNumbers = screen.getAllByTestId(PAGE_NUMBER_TEST_ID);

    fireEvent.click(pageNumbers[1]);
    expect(pageNumbers[1]).toHaveClass("active");
  })

  test("AAA패턴에 어긋나는 엣지 테스트",()=>{
    const {prevButton,nextButton} = RenderPageNumbers();
    
    fireEvent.click(prevButton);
    expect(prevButton).toHaveClass("disabled");
    fireEvent.click(nextButton);
    expect(nextButton).toHaveClass("disabled");
  })
});
