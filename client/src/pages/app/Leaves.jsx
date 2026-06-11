import { TabItem, Tabs } from "flowbite-react";
import React, { useState } from "react";
import { HiUserCircle } from "react-icons/hi2";
import { MdAdd, MdDashboard } from "react-icons/md";
import useLeave from "src/API/hooks/useLeave";
import useLeaveApprove from "src/API/hooks/useLeaveApprove";
import useLeavePolicies from "src/API/hooks/useLeavePolicies";
import useLeaveReject from "src/API/hooks/useLeaveReject";
import ApplyLeaveForm from "src/components/ApplyLeaveForm";
import CreateLeavePolicyForm from "src/components/CreateLeavePolicyForm";
import LeaveApplicationCardView from "src/components/LeaveApplicationCardView";
import LeaveApplicationTableView from "src/components/LeaveApplicationTableView";
import LeavePolicies from "src/components/LeavePolicies";
import SolidButton from "src/components/SolidButton";

import UpdateLeaveForm from "src/components/UpdateLeaveForm";
import UpdateLeavePolicyForm from "src/components/UpdateLeavePolicyForm";
import useIsMobile from "src/hooks/useIsMobile";

const Leaves = () => {
  const isMobile = useIsMobile();
  const [isLeaveCreateFormOpen, setIsLeaveCreateFormOpen] = useState(false);
  const [isLeaveUpdateFormOpen, setIsLeaveUpdateFormOpen] = useState(null);
  const [isLeaveApplyFormOpen, setIsLeaveApplyFormOpen] = useState(false);
  const [isLeavePolicyUpdateFormOpen, setIsLeavePolicyUpdateFormOpen] = useState(null);
  const handleCloseLeaveCreateForm = () => setIsLeaveCreateFormOpen(false);
  const handleCloseLeavePolicyUpdateForm = () => setIsLeavePolicyUpdateFormOpen(false);
  const handleCloseLeaveApplyForm = () => setIsLeaveApplyFormOpen(false);
  const handleCloseLeaveUpdateForm = () => setIsLeaveUpdateFormOpen(false);

  const { getLeavesPolicies, leavePolicies, loading: leavesPoliciesLoading } = useLeavePolicies();
  const { leaves, loading: leaveApplicationsLoading, error: leaveApplicationError, getLeaves } = useLeave();

  const { approve, loading: approvalLoading, error: approvalError } = useLeaveApprove(getLeaves);
  const { reject, loading: rejectionLoading, error: rejectionError } = useLeaveReject(getLeaves);

  return (
    <>
      <div className="flex flex-row justify-end items-center gap-5 mb-5 text-2xl text-white">
        <SolidButton Icon={MdAdd} title="Policy" onClick={() => setIsLeaveCreateFormOpen(true)} />
        <SolidButton Icon={MdAdd} title="Apply" onClick={() => setIsLeaveApplyFormOpen(true)} />
      </div>
      <UpdateLeavePolicyForm isOpen={isLeavePolicyUpdateFormOpen} setIsOpen={handleCloseLeavePolicyUpdateForm} handleClose={handleCloseLeavePolicyUpdateForm} onUpdate={getLeavesPolicies} />
      <CreateLeavePolicyForm isOpen={isLeaveCreateFormOpen} setIsOpen={handleCloseLeaveCreateForm} handleClose={handleCloseLeaveCreateForm} onCreate={getLeavesPolicies} />
      <ApplyLeaveForm isOpen={isLeaveApplyFormOpen} setIsOpen={handleCloseLeaveApplyForm} handleClose={handleCloseLeaveApplyForm} onCreate={() => null} />
      <UpdateLeaveForm isOpen={isLeaveUpdateFormOpen} setIsOpen={handleCloseLeaveUpdateForm} handleClose={handleCloseLeaveApplyForm} onUpdate={getLeaves} />
      <Tabs variant="underline">
        <TabItem title="Policies" icon={HiUserCircle}>
          <div className="grid mt-5 grid-cols-1 xl:grid-cols-3 justify-center gap-3 py-2">
            <div className="col-span-1">
              <LeavePolicies onClickUpdate={setIsLeavePolicyUpdateFormOpen} leavePolicies={leavePolicies} loading={leavesPoliciesLoading} />
            </div>
          </div>
        </TabItem>
        <TabItem active title="Applications" icon={MdDashboard}>
          {isMobile ? <LeaveApplicationCardView setIsLeaveUpdateFormOpen={setIsLeaveUpdateFormOpen} approve={approve} reject={reject} approvalLoading={approvalLoading} rejectionLoading={rejectionLoading} leaveApplications={leaves} loading={leaveApplicationsLoading} /> : <LeaveApplicationTableView setIsLeaveUpdateFormOpen={setIsLeaveUpdateFormOpen} approve={approve} reject={reject} approvalLoading={approvalLoading} rejectionLoading={rejectionLoading} leaveApplications={leaves} loading={leaveApplicationsLoading} />}
        </TabItem>
      </Tabs>
    </>
  );
};

export default Leaves;
