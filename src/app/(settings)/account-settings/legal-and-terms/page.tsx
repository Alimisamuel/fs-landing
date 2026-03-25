"use client";




import { Divider } from "@mui/material";
import React from "react";

const Legal = () => {
  return (
    <>
      <div className="text-black">
        <p className="text-[18px] font-bold">Legal & Terms</p>
        <p className="text-[#667085] text-[14px] mt-1">
      Review and manage the key legal agreements, policies, and account terms that guide how you use FaithStream.
        </p>
    
        <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
        <div>
         <p className="font-[500]">Terms of Use</p>
         <p className="text-[14px] text-[#667085] mt-1">
          Understand the rules that govern how you access and use FaithStream across all platforms. This includes your responsibilities as a user, how we deliver our services, and the conditions around subscriptions, payments, and cancellations.
         </p>
        </div>
        <div className="mt-6">
         <p className="font-[500]">Privacy Policy</p>
         <p className="text-[14px] text-[#667085] mt-1">
         Learn how we collect, use, store, and protect your personal information. This covers what data we collect, how it’s used to enhance your experience, and your rights regarding your personal data, including how to request changes or deletion.
         </p>
        </div>
        <div className="mt-6">
         <p className="font-[500]">Cookie Preferences</p>
         <p className="text-[14px] text-[#667085] mt-1">
        Manage how cookies are used on FaithStream. Adjust your settings to control how we track usage data, remember preferences, and personalize recommendations. You can update your cookie choices anytime for web and mobile browsers.
         </p>
        </div>
        <div className="mt-6">
         <p className="font-[500]">Subscription & Billing Terms</p>
         <p className="text-[14px] text-[#667085] mt-1">
    Get full details about your subscription plan, billing cycles, renewals, and payment methods. This section explains how we process payments, what happens with failed transactions, and how refunds are handled in specific situations.
         </p>
        </div>
        <div className="mt-6">
         <p className="font-[500]">Community Guidelines</p>
         <p className="text-[14px] text-[#667085] mt-1">
Read about the standards we expect all FaithStream members to uphold while engaging with content and community features. These guidelines promote respect, kindness, and constructive discussions aligned with our faith-based mission.
         </p>
        </div>
        <div className="mt-6">
         <p className="font-[500]">Parental Controls & Content Guidelines</p>
         <p className="text-[14px] text-[#667085] mt-1">
Review how we help families manage safe and appropriate viewing. This section outlines available parental controls, how content ratings work on FaithStream, and how we classify faith-based and family-friendly materials.
         </p>
        </div>
        <div className="mt-6">
         <p className="font-[500]">Copyright Policy</p>
         <p className="text-[14px] text-[#667085] mt-1">
Learn about how we handle copyrighted materials, intellectual property rights, and what to do if you believe your content has been used improperly on our platform. This also includes instructions for submitting copyright claims.
         </p>
        </div>
        <div className="mt-6">
         <p className="font-[500]">License Agreement</p>
         <p className="text-[14px] text-[#667085] mt-1">
Understand the terms under which we grant you access to stream and view content on FaithStream. This covers how you can use our content for personal, non-commercial viewing, and any restrictions around sharing or redistribution.
         </p>
        </div>
        <div className="mt-6 mb-6">
         <p className="font-[500]">Contact Us (Legal Inquiries)</p>
         <p className="text-[14px] text-[#667085] mt-1">
If you have questions about any of our legal policies or need support with legal matters related to your account, this section provides clear instructions on how to contact our Legal & Compliance team.
         </p>
        </div>

      
       
      </div>
    </>
  );
};

export default Legal;
