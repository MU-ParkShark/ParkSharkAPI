// import { scheduleQueries } from "./Schedules/resolvers.js";
// import { tagQueries } from "./Tags/resolvers.js";
// import { userQueries, userMutations } from "./Users/resolvers.js";
import axios from 'axios';

// const queries = {
//     ...userQueries,
//     ...tagQueries,
//     ...scheduleQueries
// };

// const mutations = {
//     ...userMutations
// };

// export const resolvers = {
//     Query: queries,
//     Mutation: mutations,
// };

const BASE_URL = 'http://localhost:3000';

// Utility function to make REST calls
const restCall = async (endpoint: string, method = 'GET', data: any | null = null) => {
    try {
      const config = {
        method,
        url: `${BASE_URL}${endpoint}`,
        ...(data !== null && { data }), // Only include data if it's not null
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      throw error;
    }
  };

// Type transformers to ensure REST responses match GraphQL types
const transformUser = (userData: any): any => ({
    user_id: userData.user_id,
    vehicle_make: userData.vehicle_make,
    vehicle_model: userData.vehicle_model,
    vehicle_year: userData.vehicle_year,
    vehicle_color: userData.vehicle_color,
    license_plate: userData.license_plate,
    tag_id: userData.tag_id,
    first_name: userData.first_name,
    last_name: userData.last_name,
  });
  
  const transformPoint = (pointData: any): any => {
    if (!pointData) return null;
    // Handle both GeoJSON and custom point formats
    const coordinates = pointData.coordinates || [pointData.longitude, pointData.latitude];
    return {
      type: "Point",
      coordinates,
      longitude: coordinates[0],
      latitude: coordinates[1]
    };
  };
  
  const transformTagActivity = (activityData: any): any => ({
    tag_activity_id: activityData.tag_activity_id,
    location: activityData.location ? transformPoint(activityData.location) : null,
    update_timestamp: activityData.update_timestamp,
    location_unchanged_counter: activityData.location_unchanged_counter,
    tag_id: activityData.tag_id,
    status: activityData.status
  });
  
  const transformLotActivity = (activityData: any): any => ({
    activity_id: activityData.activity_id,
    timeslot: activityData.timeslot,
    day_of_week: activityData.day_of_week,
    ptime_in: activityData.ptime_in,
    ptime_out: activityData.ptime_out,
    user_id: activityData.user_id,
    spot_id: activityData.spot_id,
    tag_activity_id: activityData.tag_activity_id
  });
  
  export const resolvers = {
    Query: {
      // User Queries
      user: async (_: any, { user_id }: { user_id: number }) => {
        const userData = await restCall(`/users/getUser/${user_id}`);
        return transformUser(userData);
      },
  
      userByLicensePlate: async (_: any, { license_plate }: { license_plate: string }) => {
        const users = await restCall('/users/getUsers');
        const user = users.find((u: any) => u.license_plate === license_plate);
        return user ? transformUser(user) : null;
      },
  
      userByTag: async (_: any, { tag_id }: { tag_id: number }) => {
        const tag = await restCall(`/tags/${tag_id}`);
        if (!tag) return null;
        const userData = await restCall(`/users/getUser/${tag.user_id}`);
        return transformUser(userData);
      },
  
      // Lot Queries
      lot: async (_: any, { lot_id }: { lot_id: number }) => {
        const lot = await restCall(`/lots/getLots/${lot_id}`);
        return lot ? {
          lot_id: lot.lot_id,
          lot_type: lot.lot_type,
          is_available: Boolean(lot.is_available),
          auto_lot_id: lot.auto_lot_id,
          bounding_box: lot.bounding_box
        } : null;
      },
  
      lots: async () => {
        const lots = await restCall('/lots/getLots');
        return lots.map((lot: any) => ({
          lot_id: lot.lot_id,
          lot_type: lot.lot_type,
          is_available: Boolean(lot.is_available),
          auto_lot_id: lot.auto_lot_id,
          bounding_box: lot.bounding_box
        }));
      },

      lotOccupancy: async () => {
        try {
          const occupancy = await restCall('/lots/getOccupancy');
          return occupancy.map((lot: any) => ({
            lot_id: parseInt(lot.lot_id),
            totalCount: lot.totalCount,
            occupiedCount: lot.occupiedCount,
            relativeOccupancy: lot.relativeOccupancy,
            lotType: lot.lotType
          }));
        } catch (error) {
          console.error('Error fetching lot occupancy:', error);
          throw error;
        }
      },
  
      lotOccupancyById: async (_: any, { lot_id }: { lot_id: number }) => {
        try {
          const occupancy = await restCall(`/lots/getOccupancy/${lot_id}`);
          return {
            lot_id: parseInt(occupancy.lot_id),
            totalCount: occupancy.totalCount,
            occupiedCount: occupancy.occupiedCount,
            relativeOccupancy: occupancy.relativeOccupancy,
            lotType: occupancy.lotType
          };
        } catch (error) {
          console.error('Error fetching lot occupancy by ID:', error);
          throw error;
        }
      },
  
      lotSpots: async (_: any, { lot_id }: { lot_id: number }) => {
        try {
          const spots = await restCall(`/lots/getSpots/${lot_id}`);
          return {
            lot_id: lot_id,
            spots: spots.map((spot: any) => ({
              spot_id: spot.spot_id,
              is_handicap: Boolean(spot.is_handicap),
              latlong: transformPoint(spot.latlong),
              is_available: Boolean(spot.is_available),
              row_id: spot.row_id,
              lot_id: spot.lot_id
            }))
          };
        } catch (error) {
          console.error('Error fetching lot spots:', error);
          throw error;
        }
      },
  
      // Parking Spot Queries
      parkingSpot: async (_: any, { spot_id }: { spot_id: number }) => {
        const spots = await restCall('/spots/allSpots');
        const spot = spots.find((s: any) => s.spot_id === spot_id);
        return spot ? {
          spot_id: spot.spot_id,
          is_handicap: Boolean(spot.is_handicap),
          latlong: transformPoint(spot.latlong),
          is_available: Boolean(spot.is_available),
          row_id: spot.row_id,
          lot_id: spot.lot_id
        } : null;
      },
  
      nearbySpots: async (_: any, { latitude, longitude, radius }: any) => {
        const spotData = await restCall('/spots/find', 'POST', { latitude, longitude });
        return Array.isArray(spotData) ? spotData.map((spot: any) => ({
          spot_id: spot.spot_id,
          is_handicap: Boolean(spot.is_handicap),
          latlong: transformPoint(spot.latlong),
          is_available: Boolean(spot.is_available),
          row_id: spot.row_id,
          lot_id: spot.lot_id
        })) : [];
      },
  
      // Schedule Queries
      schedule: async (_: any, { schedule_id }: { schedule_id: number }) => {
        const schedules = await restCall(`/schedules/getUserSchedule/${schedule_id}`);
        const schedule = schedules[0];
        return schedule ? {
          schedule_id: schedule.schedule_id,
          user_id: schedule.user_id,
          time_in: schedule.time_in,
          day_of_week: schedule.day_of_week,
          event_name: schedule.event_name,
          lots: schedule.lots
        } : null;
      },

      userSchedules: async (_: any, { user_id }: { user_id: number }) => {
        try {
          const schedules = await restCall(`/schedules/getUserSchedule/${user_id}`);
          return schedules.map((schedule: any) => ({
            schedule_id: schedule.schedule_id,
            user_id: schedule.user_id,
            time_in: schedule.time_in,
            day_of_week: schedule.day_of_week,
            event_name: schedule.event_name,
            lots: schedule.lots
          }));
        } catch (error) {
          console.error('Error fetching user schedules:', error);
          throw error;
        }
      },
  
      // Tag Queries
      tag: async (_: any, { tag_id }: { tag_id: number }) => {
        const tag = await restCall(`/tags/${tag_id}`);
        return tag ? {
          tag_id: tag.tag_id,
          user_id: tag.user_id,
          serial_code: tag.serial_code
        } : null;
      },
  
      tagBySerialCode: async (_: any, { serial_code }: { serial_code: string }) => {
        const tags = await restCall('/tags');
        const tag = tags.find((t: any) => t.serial_code === serial_code);
        return tag ? {
          tag_id: tag.tag_id,
          user_id: tag.user_id,
          serial_code: tag.serial_code
        } : null;
      },
  
      // Tag Activity Queries
      tagActivity: async (_: any, { tag_activity_id }: { tag_activity_id: number }) => {
        const activity = await restCall(`/tagActivity/${tag_activity_id}`);
        return activity ? transformTagActivity(activity) : null;
      },

      tagLocation: async (_: any, { tag_id }: { tag_id: number }) => {
        try {
          const locationData = await restCall(`/tagActivity/${tag_id}/location`);
          
          // Extract coordinates from ST_AsText(location) format which looks like 'POINT(long lat)'
          const pointMatch = locationData[0]?.['ST_AsText(location)']?.match(/POINT\((.*?)\)/);
          
          let coordinates = null;
          
          if (pointMatch) {
            const [latitude, longitude] = pointMatch[1].split(' ').map(Number);
            
            coordinates = {
              type: "Point",
              coordinates: [longitude, latitude],
              longitude,
              latitude
            };
          }
  
          return {
            ST_AsText: locationData[0]?.['ST_AsText(location)'],
            coordinates
          };
        } catch (error) {
          console.error('Error fetching tag location:', error);
          throw error;
        }
      },
  
      // Lot Activity Queries
      lotActivity: async (_: any, { activity_id }: { activity_id: number }) => {
        const activity = await restCall(`/lotactivity/${activity_id}`);
        
        return activity ? transformLotActivity(activity[0]) : null;
      },

      spotActivity: async (_: any, { spot_id }: { spot_id: number }) => {
        try {
          const activities = await restCall(`/lotactivity/spot/${spot_id}`);
          return activities.map((activity: any) => ({
            activity_id: activity.activity_id,
            timeslot: activity.timeslot,
            day_of_week: activity.day_of_week,
            ptime_in: activity.ptime_in,
            ptime_out: activity.ptime_out,
            user_id: activity.user_id,
            spot_id: activity.spot_id,
            status: activity.status || "VOID", // Providing default status
            tag_activity_id: activity.tag_activity_id
          }));
        } catch (error) {
          console.error('Error fetching spot activity:', error);
          throw error;
        }
      }
    },
  
    Mutation: {
      // User Mutations
      createUser: async (_: any, { input }: any) => {
        const response = await restCall('/users/createUser', 'POST', input);
        return transformUser(response.user);
      },
  
      updateUser: async (_: any, { user_id, input }: any) => {
        const response = await restCall(`/users/updateUser/${user_id}`, 'PATCH', input);
        return transformUser(response);
      },
  
      deleteUser: async (_: any, { user_id }: { user_id: number }) => {
        const response = await restCall(`/users/deleteUser/${user_id}`, 'DELETE');
        return Boolean(response);
      },
  
      // Schedule Mutations
      createSchedule: async (_: any, { input }: any) => {
        try {
          const response = await restCall('/schedules/setSchedule', 'POST', {
            userId: input.user_id,
            timeIn: input.time_in,
            dayOfWeek: input.day_of_week,
            eventName: input.event_name,
            lots: input.lots
          });

          console.log(response);

          return {
            schedule_id: response.schedule_id,
            user_id: response.user_id,
            time_in: response.time_in,
            day_of_week: response.day_of_week,
            event_name: response.event_name,
            lots: response.lots
          };
        } catch (error) {
          console.error('Error creating schedule:', error);
          throw error;
        }
      },
  
      updateSchedule: async (_: any, { schedule_id, input }: any) => {
        const response = await restCall(`/schedules/updateSchedule/${schedule_id}`, 'PATCH', input);
        return {
          schedule_id: response.schedule_id,
          user_id: response.user_id,
          time_in: response.time_in,
          day_of_week: response.day_of_week,
          event_name: response.event_name,
          lots: response.lots
        };
      },
  
      deleteSchedule: async (_: any, { schedule_id }: { schedule_id: number }) => {
        const response = await restCall(`/schedules/deleteScheduleEntry/${schedule_id}`, 'DELETE');
        return Boolean(response);
      },
  
      // Tag Mutations
      createTag: async (_: any, { input }: any) => {
        const response = await restCall('/tags', 'POST', input);
        return {
          tag_id: response.tag.tag_id,
          user_id: response.tag.user_id,
          serial_code: response.tag.serial_code
        };
      },
  
      updateTag: async (_: any, { tag_id, input }: any) => {
        const response = await restCall(`/tags/${tag_id}`, 'PUT', input);
        return {
          tag_id: response.tag_id,
          user_id: response.user_id,
          serial_code: response.serial_code
        };
      },
  
      deleteTag: async (_: any, { tag_id }: { tag_id: number }) => {
        const response = await restCall(`/tags/${tag_id}`, 'DELETE');
        return response === 'Tag deleted.';
      },
  
      // Tag Activity Mutations
      updateTagActivity: async (_: any, { tag_id, input }: any) => {
        const response = await restCall(`/tagActivity/${tag_id}/location`, 'PUT', {
          message: input.status === 'PARKED' ? 'DISCONNECT' : 'CHECK',
          long: input.location.coordinates[0],
          lat: input.location.coordinates[1],
          user_id: input.user_id
        });
        return transformTagActivity(response);
      },

      updateTagLocation: async (_: any, { 
        tag_id, 
        input: { message, long, lat, user_id } 
      }: { 
        tag_id: number, 
        input: { 
          message: "CHECK" | "DISCONNECT", 
          long: number, 
          lat: number, 
          user_id: number 
        } 
      }) => {
        try {
          // Validate message type
          if (message !== "CHECK" && message !== "DISCONNECT") {
            throw new Error("Invalid message type. Must be either 'CHECK' or 'DISCONNECT'");
          }
  
          const response = await restCall(`/tagActivity/${tag_id}/location`, 'PUT', {
            message,
            long,
            lat,
            user_id
          });
  
          return {
            success: response.success,
            state: response.state,
            spotData: response.spotData ? {
              spot_id: response.spotData.spot_id,
              location: response.spotData.location
            } : null,
            message: response.message
          };
        } catch (error) {
          console.error('Error updating tag location:', error);
          throw error;
        }
      },
  
      unmarkTagAsParked: async (_: any, { 
        input: { spot_id } 
      }: { 
        input: { spot_id: number } 
      }) => {
        try {
          const response = await restCall(`/tagActivity/unparked/${spot_id}`, 'POST', {});
          
          return {
            success: response.success,
          };
        } catch (error) {
          console.error('Error unmarking tag as parked:', error);
          throw error;
        }
      },
  
      // Lot Activity Mutations
      createSpotActivity: async (_: any, { 
        spot_id, 
        input 
      }: { 
        spot_id: number, 
        input: {
          timeslot?: string,
          day_of_week: number,
          ptime_in: string,
          ptime_out?: string,
          user_id: number,
          status?: string,
          tag_activity_id: number
        }
      }) => {
        try {
          const response = await restCall(`/lotactivity/spot/${spot_id}`, 'POST', {
            timeslot: input.timeslot,
            day_of_week: input.day_of_week,
            ptime_in: input.ptime_in,
            ptime_out: input.ptime_out,
            user_id: input.user_id,
            status: input.status || "VOID", // Providing default status
            tag_activity_id: input.tag_activity_id
          });
  
          return {
            activity_id: response.activity_id,
            timeslot: response.timeslot,
            day_of_week: response.day_of_week,
            ptime_in: response.ptime_in,
            ptime_out: response.ptime_out,
            user_id: response.user_id,
            spot_id: spot_id,
            status: response.status || "VOID",
            tag_activity_id: response.tag_activity_id
          };
        } catch (error) {
          console.error('Error creating spot activity:', error);
          throw error;
        }
      }
    },
  
    // Type Resolvers
    User: {
      tag: async (parent: any) => {
        if (!parent.tag_id) return null;
        const tag = await restCall(`/tags/${parent.tag_id}`);
        return tag ? {
          tag_id: tag.tag_id,
          user_id: tag.user_id,
          serial_code: tag.serial_code
        } : null;
      },
      schedules: async (parent: any) => {
        const schedules = await restCall(`/schedules/getUserSchedule/${parent.user_id}`);
        return schedules.map((schedule: any) => ({
          schedule_id: schedule.schedule_id,
          user_id: schedule.user_id,
          time_in: schedule.time_in,
          day_of_week: schedule.day_of_week,
          event_name: schedule.event_name,
          lots: schedule.lots
        }));
      },
      credential: async (parent: any) => {
        const user = await restCall(`/users/getUser/${parent.user_id}`);
        return {
          email: user.email,
          user_id: parent.user_id
        };
      }
    },
  
    Tag: {
      user: async (parent: any) => {
        const userData = await restCall(`/users/getUser/${parent.user_id}`);
        return transformUser(userData);
      }
    },
  
    TagActivity: {
        tag: async (parent: any) => {
          const tag = await restCall(`/tags/${parent.tag_id}`);
          return tag ? {
            tag_id: tag.tag_id,
            user_id: tag.user_id,
            serial_code: tag.serial_code
          } : null;
        },
        user: async (parent: any) => {
          const tag = await restCall(`/tags/${parent.tag_id}`);
          if (!tag) return null;
          const userData = await restCall(`/users/getUser/${tag.user_id}`);
          return transformUser(userData);
        }
      },
  
      TagLocation: {
        coordinates: (parent: any) => {
          if (!parent.ST_AsText) return null;
          
          const pointMatch = parent.ST_AsText.match(/POINT\((.*?)\)/);
          if (!pointMatch) return null;
  
          const [longitude, latitude] = pointMatch[1].split(' ').map(Number);
          return {
            type: "Point",
            coordinates: [longitude, latitude],
            longitude,
            latitude
          };
        }
      },
      
      TagStateResponse: {
        state: (parent: any) => {
          // Ensure the state is one of the valid enum values
          return parent.state === "PARKED" || parent.state === "UNDECIDED" 
            ? parent.state 
            : "UNDECIDED";
        }
      },
  
      LotActivity: {
        user: async (parent: any) => {
          const userData = await restCall(`/users/getUser/${parent.user_id}`);
          return transformUser(userData);
        },
        tagActivity: async (parent: any) => {
          const activity = await restCall(`/tagActivity/${parent.tag_activity_id}`);
          return activity ? transformTagActivity(activity) : null;
        },
        spot: async (parent: any) => {
          const lot = await restCall(`/lots/getLots/${parent.spot_id}`);
          return lot ? {
            lot_id: lot.lot_id,
            lot_type: lot.lot_type,
            is_available: Boolean(lot.is_available),
            auto_lot_id: lot.auto_lot_id,
            bounding_box: lot.bounding_box
          } : null;
        }
      }
  };