import React from "react";
import { Table, Button } from "react-bootstrap";
import { useGetUsersQuery } from "../../slices/usersApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const UsersEmailListScreen = () => {
  // Fetch the data from the backend (data returned as { users: [...] })
  const { data: users, isLoading, error } = useGetUsersQuery();

  // Handler to download the emails as a text file (emails separated by "; ")
  const handleDownload = () => {
    const content = users
      .map((user) => `${user.name} <${user.email}>`)
      .join("; ");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "emails.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handler to open the default email client with a mailto link
  const handleSendEmail = () => {
    const recipients = users.map((user) => user.email).join("; ");
    window.location.href = `mailto:${recipients}`;
  };

  return (
    <>
      <h1>Lista de Emails</h1>
      <Button variant="primary" onClick={handleDownload} className="mb-3">
        Baixar Emails dos Clientes
      </Button>
      <Button variant="primary" onClick={handleSendEmail} className="mb-3 ms-2">
        Enviar Email aos Clientes
      </Button>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UsersEmailListScreen;
