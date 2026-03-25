"use client";



import FsSwitch from "@/components/custom/FsSwitch";
import { Divider } from "@mui/material";
import React from "react";

const Notifications = () => {
  return (
    <>
      <div className="text-black">
        <p className="text-[18px] font-bold">Notifications</p>
        <p className="text-[#667085] text-[14px] mt-1">
          Manage how we keep you informed. Choose the type of updates, and
          account alerts you’d like to receive from us.
        </p>
  
            <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
        <div>
          <div className="flex flex-row gap-x-4">
            <div className="w-[35%]">
              <p className="text-[14px] font-medium">Email Notifications</p>
              <p className="text-[#667085] text-[12px] mt-1">
                Receive updates directly in your inbox.
              </p>
            </div>
            <div className="w-[50%] ">
              <div className="flex flex-row gap-x-5">
                <FsSwitch checked customColor="#0F973D" />
                <div>
                  <p className="text-[14px] font-[500]">
                    New Releases & Recommendations.
                  </p>
                  <p className="text-[12px] text-[#667085]">
                    Get notified about the latest faith-based films, series, and
                    documentaries tailored to your interest.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-x-5 mt-3">
                <FsSwitch customColor="#0F973D" />
                <div>
                  <p className="text-[14px] font-[500]">
                    Special Offers & Promotions.
                  </p>
                  <p className="text-[12px] text-[#667085]">
                    Receive exclusive offers, discounts, and special
                    announcement
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-x-5 mt-3">
                <FsSwitch customColor="#0F973D" />
                <div>
                  <p className="text-[14px] font-[500]">Account Updates</p>
                  <p className="text-[12px] text-[#667085]">
                    Get important alerts about billing, password changes, and
                    account security.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-x-5 mt-3">
                <FsSwitch customColor="#0F973D" />
                <div>
                  <p className="text-[14px] font-[500]">
                    Weekly Inspiration Highlights
                  </p>
                  <p className="text-[12px] text-[#667085]">
                    Opt-in for a curated list of uplifting titles and stories
                    sent once a week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      
            <Divider sx={{my:4, bgcolor:'#EAECF0'}} />
         <div>
          <div className="flex flex-row gap-x-4">
            <div className="w-[35%]">
              <p className="text-[14px] font-medium">Push Notifications</p>
              <p className="text-[#667085] text-[12px] mt-1">
              Stay informed on your mobile device or tablet.
              </p>
            </div>
            <div className="w-[50%] ">
              <div className="flex flex-row gap-x-5">
                <FsSwitch customColor="#0F973D" />
                <div>
                  <p className="text-[14px] font-[500]">
                   New Content Alerts.
                  </p>
                  <p className="text-[12px] text-[#667085]">
                Get notified when new movies, series, or documentaries are added to the platform.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-x-5 mt-3">
                <FsSwitch checked customColor="#0F973D" />
                <div>
                  <p className="text-[14px] font-[500]">
                    Reminders & Suggestions
                  </p>
                  <p className="text-[12px] text-[#667085]">
                    Receive reminders to continue watching or suggestions based on your recent activity.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-x-5 mt-3">
                <FsSwitch  customColor="#0F973D"/>
                <div>
                  <p className="text-[14px] font-[500]">Account Activity Alerts.</p>
                  <p className="text-[12px] text-[#667085]">
                    Be notified about sign-ins, devices changes, or payment confirmations.
                  </p>
                </div>
              </div>
            
            </div>
          </div>
        </div>
        
            <Divider sx={{my:4, bgcolor:'#EAECF0'}} />
         <div>
          <div className="flex flex-row gap-x-4">
            <div className="w-[35%]">
              <p className="text-[14px] font-medium">In-App Notifications</p>
              <p className="text-[#667085] text-[12px] mt-1">
              See updates directly within the app or website.
              </p>
            </div>
            <div className="w-[50%] ">
              <div className="flex flex-row gap-x-5">
                <FsSwitch checked customColor="#0F973D" />
                <div>
                  <p className="text-[14px] font-[500]">
                   Content Updates.
                  </p>
                  <p className="text-[12px] text-[#667085]">
             Get in-app alerts about new releases and featured collections.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-x-5 mt-3">
                <FsSwitch customColor="#0F973D" />
                <div>
                  <p className="text-[14px] font-[500]">
                  Faith-Based Recommendations.
                  </p>
                  <p className="text-[12px] text-[#667085]">
        See personalized faith-driven content suggestions right inside the app.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-x-5 mt-3">
                <FsSwitch customColor="#0F973D" />
                <div>
                  <p className="text-[14px] font-[500]">Community Announcements.</p>
                  <p className="text-[12px] text-[#667085]">
                 Stay updates on platform-wide events, live streams, or special screenings.
                  </p>
                </div>
              </div>
            </div>
          </div>
                 
                     <Divider sx={{my:5, bgcolor:'#EAECF0'}} />
        </div>
      </div>
    </>
  );
};

export default Notifications;
