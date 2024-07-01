import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
  flex-wrap: wrap;
  @media (max-width: 700px) {
    h1 {
      font-size: 14px;
    }
  }
`;
export const TitlePage = styled.div`
  h1 {
    font-size: 18px;
  }
  @media (max-width: 400px) {
    justify-content: start;
    align-items: center;
    h1 {
      font-size: 16px;
    }
  }
`;
export const CardRoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-radius: 10px;
  border-bottom: 5px solid red;
  width: 235px;
  height: 110px;
  box-shadow: 0px 0px 10px 1px rgb(241 10 149 / 20%);
  @media (max-width: 600px) {
    margin: 10px auto;
  }
`;

export const CardHead = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
export const CardTitle = styled.h1`
  font-size: 10px;
`;
export const CardContent = styled.div`
  width: 100%;
  padding: 0px 8px;
  font-size: 7px;
  text-align: justify;
`;
