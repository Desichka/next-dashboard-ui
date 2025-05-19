'use client';

import { Design, DesignChecklistItem, ChecklistItem, User } from '@prisma/client';
import { deleteDesign } from '@/app/actions/deleteDesign';
import { saveDesign } from '@/app/actions/saveDesign'; // Import saveDesign
import { useState } from 'react'; // Import useState

// Define props type including the checklistItems relation
interface DesignDetailClientPageProps {
  design: Design & {
    checklistItems: (DesignChecklistItem & {
      checklistItem: ChecklistItem | null;
      user: User | null;
    })[];
  };
}

export default function DesignDetailClientPage({ design }: DesignDetailClientPageProps) {
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  const [editedDesign, setEditedDesign] = useState(design); // State to hold edited data

  const handleSave = async () => {
    console.log('Attempting to save design:', editedDesign);
    try {
      // Transform checklistItems to match the expected input type
      const transformedChecklistItems = editedDesign.checklistItems.map(item => ({
        checklistItemId: item.checklistItemId === null ? undefined : item.checklistItemId,
        customText: item.customText === null ? undefined : item.customText, // Transform customText
        isChecked: item.isChecked,
      }));

      // Call saveDesign action with isNewCompany: false for updates
      await saveDesign({
        ...editedDesign,
        isNewCompany: false,
        checklistItems: transformedChecklistItems, // Use the transformed items
      });
      // The action redirects on success, so no need to setIsEditing(false) here
    } catch (error: any) {
      console.error('Failed to save design:', error);
      alert(`Failed to save design: ${error.message || 'An unknown error occurred'}`);
    }
  };

  const handleCancel = () => {
    setEditedDesign(design); // Revert changes
    setIsEditing(false); // Exit edit mode
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedDesign(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Design Details</h1> {/* Added styling */}
      <div className="space-y-4"> {/* Added spacing */}
        <p><strong>ID:</strong> {design.id}</p> {/* Added bolding */}
        <div>
          <strong>Template Name:</strong>{' '}
          {isEditing ? (
            <input
              type="text"
              name="templateName"
              value={editedDesign.templateName}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          ) : (
            <span>{design.templateName}</span>
          )}
        </div>
        <div>
          <strong>Status:</strong>{' '}
          {isEditing ? (
             <input
              type="text" // Consider using a select dropdown for status
              name="status"
              value={editedDesign.status}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          ) : (
            <span>{design.status}</span>
          )}
        </div>
        <p><strong>Created At:</strong> {design.createdAt.toDateString()}</p> {/* Added bolding */}
        <p><strong>Updated At:</strong> {design.updatedAt.toDateString()}</p> {/* Added bolding */}
        {/* Add other fields from the design model here */}
         <div>
          <strong>Company ID:</strong>{' '}
          {isEditing ? (
             <input
              type="text" // Consider using a select dropdown for company
              name="companyId"
              value={editedDesign.companyId}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          ) : (
            <span>{design.companyId}</span>
          )}
        </div>
         <div>
          <strong>User ID:</strong>{' '}
          {isEditing ? (
             <input
              type="text" // Consider using a select dropdown for user
              name="userId"
              value={editedDesign.userId}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          ) : (
            <span>{design.userId}</span>
          )}
        </div>
         <div>
          <strong>Partners:</strong>{' '}
          {isEditing ? (
             <input
              type="text"
              name="partners"
              value={editedDesign.partners || ''} // Handle null partners
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          ) : (
            <span>{design.partners}</span>
          )}
        </div>
        {/* Note ID might not be relevant to display directly */}
        {/* <p><strong>Note ID:</strong> {design.noteId}</p> */}

        {/* Display Checklist */}
        <div className="border p-4 rounded border-gray-300 dark:border-gray-600"> {/* Added styling */}
          <h2 className="text-lg font-semibold mb-3">Checklist</h2> {/* Added styling */}
          {design.checklistItems && design.checklistItems.length > 0 ? (
            <ul className="space-y-2"> {/* Added spacing */}
              {design.checklistItems.map((item) => (
                <li key={item.id} className="flex items-center space-x-2"> {/* Added styling */}
                  <input
                    type="checkbox"
                    checked={item.isChecked}
                    readOnly // Checklist is read-only on detail page
                    className="form-checkbox h-5 w-5 text-blue-600 rounded" // Added styling
                  />
                  <span className="text-sm"> {/* Added styling */}
                    {item.checklistItem?.text || item.customText}
                    {item.user ? ' (Checked by: ' + (item.user.name || item.user.username) + ')' : null} {/* Display who checked */}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No checklist items for this design.</p> 
        

          )}
        </div>
        <div>
          <p><strong>Design Notes:</strong></p> {/* Added bolding */}
           {isEditing ? (
            <textarea
              name="designNotes"
              value={editedDesign.designNotes || ''} // Handle null notes
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full h-32" // Added styling
            />
          ) : (
            <div className="border p-3 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 whitespace-pre-wrap"> {/* Added styling and pre-wrap for notes */}
              {design.designNotes || 'No notes available.'}
            </div>
          )}
        </div>

      </div>
      <div className="mt-6 flex space-x-4"> {/* Added margin top and spacing */}
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Design
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Design
            </button>
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to delete this design?')) {
                  const { success, error } = await deleteDesign(design.id);
                  if (success) {
                    window.location.href = '/list/designs'; // Redirect after successful deletion
                  } else {
                    alert(`Failed to delete design: ${error}`);
                  }
                }
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete Design
            </button>
          </>
        )}
        <a href="/list/designs" className="text-blue-500 hover:underline flex items-center"> {/* Added styling */}
          Back to Designs
        </a>
      </div>
    </div>
  );
}
