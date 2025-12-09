import React from 'react';
import { Button, Select } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FiPlus } from 'react-icons/fi';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { DateInput } from '@mantine/dates';

const DestinationTable = ({ locations, district, place, handleLocationChange, handleDateChange, handleAddRow, deleteAllRows, isDisabled }) => {
  // Function to check if the departure place matches the location
  const calculateDaysAndNights = (location) => {
    const days = location.days || 0;
    const nights = location.nights || 0;

    // Check if departure place matches the location
    if (place === location.location) {
      return { days, nights: 0 }; // No nights if departure location matches
    } else {
      return { days, nights }; // Use the provided values otherwise
    }
  };

  return (
    <div className="dest-header">
      <h3 className="attachments1">Destination</h3> 
      <div className="table1">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <Button
            className="add-row-btn"
            onClick={isDisabled ? () => {} : handleAddRow}
            variant="gradient"
            gradient={{ from: 'blue', to: 'blue', deg: 90 }}
            size="xs"
          >
            <FiPlus style={{ marginRight: '6px', fontSize: 18 }} />
            Add New Destination
          </Button>
        </div>
        <table id="missionTable">
          <thead>
            <tr>
              <th rowSpan="2">Location</th>
              <th rowSpan="2">Date From</th>
              <th rowSpan="2">Date To</th>
              <th colSpan="2" className="mission-duration" style={{ width: 200, padding: 8 }}>Mission Duration</th>
              <th rowSpan="2">Actions</th>
            </tr>
            <tr>
              <th style={{ width: 45, padding: 1 }}>Days</th>
              <th style={{ width: 45, padding: 1 }}>Nights</th>
            </tr>
          </thead>
          <tbody id="tableBody">
            {locations.map((location, index) => {
              const { days, nights } = calculateDaysAndNights(location);

              return (
                <tr key={index}>
                  <td>
                    <Select
                      placeholder="Location"
                      className="td_dropdown"
                      name="location"
                      id={`location-${index}`}
                      value={location.location || ""}
                      style={{ border: 0 }}
                      onChange={(value) => handleLocationChange(index, 'location', value)}
                      data={district}
                      searchable
                    />
                  </td>
                  <td>
                    <DateInput
                      id={`dateFrom-${index}`}
                      value={location.dateFrom || ""}
                      onChange={(value) => handleDateChange(index, 'dateFrom', value)}
                      minDate={new Date()}
                      maxDate={dayjs(new Date()).add(2, 'month').toDate()}
                      placeholder="Date input"
                      readOnly
                    />
                  </td>
                  <td>
                    <DateInput
                      id={`dateTo-${index}`}
                      value={location.dateTo || ""}
                      onChange={(value) => handleDateChange(index, 'dateTo', value)}
                      minDate={new Date()}
                      maxDate={dayjs(new Date()).add(2, 'month').toDate()}
                      placeholder="Date input"
                    />
                  </td>
                  <td className="table-days-nights">
                    {days || "0"}
                  </td>
                  <td className="table-days-nights">
                    {nights || "0"}
                    {/* Display 0 nights if departure place matches */}
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      size="lg"
                      style={{ cursor: 'pointer', color: 'red', padding: '2' }}
                      onClick={() => deleteAllRows(index)}
                    />
                    <span
                      style={{ color: 'red', cursor: 'pointer', fontSize: 11 }}
                      onClick={() => deleteAllRows(index)}
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DestinationTable;
