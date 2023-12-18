import Spinner from './index';

const TableLoader: React.FC = (): JSX.Element => {
  return (
    <div className="flex items-center justify-center w-100 h-64">
      <Spinner />
    </div>
  );
};

export { TableLoader };
