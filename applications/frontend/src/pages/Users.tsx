import {
  useEffect,
  useState,
} from "react";

import { authApi } from "../services/api";

type User = {
  id: number;
  email: string;
  full_name: string;
  role: string;
};

function Users() {
  const [users, setUsers] =
    useState<User[]>([]);

  const [form, setForm] =
    useState({
      organization_id: 1,
      full_name: "",
      email: "",
      password: "",
      role: "USER",
    });

  const loadUsers =
    async () => {
      const response =
        await authApi.get(
          "/users"
        );

      setUsers(
        response.data
      );
    };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser =
    async () => {
      await authApi.post(
        "/users",
        form
      );

      loadUsers();
    };

  return (
    <>
      <h1>Users</h1>

      <div className="card">
        <input
          placeholder="Full Name"
          onChange={(e) =>
            setForm({
              ...form,
              full_name:
                e.target.value,
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Password"
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <br />
        <br />

        <button
          onClick={
            createUser
          }
        >
          Create User
        </button>
      </div>

      <br />

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map(
              (user) => (
                <tr
                  key={
                    user.id
                  }
                >
                  <td>
                    {user.id}
                  </td>

                  <td>
                    {
                      user.full_name
                    }
                  </td>

                  <td>
                    {
                      user.email
                    }
                  </td>

                  <td>
                    {
                      user.role
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Users;