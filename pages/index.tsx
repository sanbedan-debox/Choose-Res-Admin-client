import MainLayout from "@/components/layouts/MainLayout";
import React from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Hello: NextPageWithLayout = () => {
  return (
    <div>
      <div>
        <button className="btn btn-primary">Primary Button</button>
        <button className="btn btn-secondary">Secondary Button</button>
        <button className="btn btn-warning">Warning Button</button>
        <button className="btn btn-confirmation">Confirmation Button</button>
        <button className="btn btn-outlined">Outlined Button</button>
        <button className="btn btn-outlined-secondary">
          Outlined Secondary Button
        </button>
        <button className="btn btn-outlined-warning">
          Outlined Warning Button
        </button>
        <button className="btn btn-outlined-confirmation">
          Outlined Confirmation Button
        </button>

        <input
          className="input input-primary"
          type="text"
          placeholder="Primary Input"
        />
        <input
          className="input input-secondary"
          type="text"
          placeholder="Secondary Input"
        />
        <input
          className="input input-warning"
          type="text"
          placeholder="Warning Input"
        />

        <div className="switch switch-primary checked"></div>
        <div className="switch switch-secondary"></div>
        <div className="switch switch-warning"></div>

        <input className="checkbox checkbox-primary" type="checkbox" />
        <input className="checkbox checkbox-secondary" type="checkbox" />
        <input className="checkbox checkbox-warning" type="checkbox" />

        <div className="box-primary">
          <p>Primary Box</p>
        </div>
        <div className="box-warning">
          <p>Warning Box</p>
        </div>
        <div className="box-confirmation">
          <p>Confirmation Box</p>
        </div>
        <div className="modal-container">
          <div className="modal">
            <p>Modal Content</p>
          </div>
        </div>
      </div>
    </div>
  );
};

Hello.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Hello;
