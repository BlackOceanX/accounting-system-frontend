import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { expenseService, Expense, ExpenseItem } from '@/services/expenseService';

// Define a type for expense items in the form (without id and expenseId)
type FormExpenseItem = Omit<ExpenseItem, 'id' | 'expenseId'>;

const expenseItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  unitPrice: z.number().min(0, 'Unit price must be at least 0'),
  amount: z.number()
});

const expenseFormSchema = z.object({
  documentNumber: z.string().nullable(),
  vendorName: z.string().min(1, 'Vendor name is required').nullable(),
  vendorDetail: z.string().nullable(),
  project: z.string().nullable(),
  referenceNumber: z.string().nullable(),
  date: z.string(),
  creditTerm: z.number().min(0),
  dueDate: z.string(),
  currency: z.string().nullable(),
  discount: z.number().min(0),
  vatIncluded: z.boolean(),
  remark: z.string().nullable(),
  internalNote: z.string().nullable(),
  totalAmount: z.number(),
  expenseItems: z.array(expenseItemSchema).min(1, 'At least one expense item is required')
});

type ExpenseFormData = z.infer<typeof expenseFormSchema>;

interface CreateExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateExpenseModal({ open, onClose, onCreated }: CreateExpenseModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      documentNumber: '',
      vendorName: '',
      vendorDetail: '',
      project: '',
      referenceNumber: '',
      date: new Date().toISOString().slice(0, 10),
      creditTerm: 0,
      dueDate: new Date().toISOString().slice(0, 10),
      currency: 'THB',
      discount: 0,
      vatIncluded: false,
      remark: '',
      internalNote: '',
      totalAmount: 0,
      expenseItems: [
        { description: '', category: '', quantity: 1, unit: '', unitPrice: 0, amount: 0 }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'expenseItems'
  });

  const watchExpenseItems = watch('expenseItems');
  const watchDate = watch('date');

  // Calculate total amount whenever expense items change
  React.useEffect(() => {
    const total = watchExpenseItems.reduce((sum: number, item: FormExpenseItem) => sum + (item.amount || 0), 0);
    setValue('totalAmount', total);
  }, [watchExpenseItems, setValue]);

  // Calculate item amount whenever quantity or unit price changes
  React.useEffect(() => {
    watchExpenseItems.forEach((item: FormExpenseItem, index: number) => {
      const amount = (item.quantity || 0) * (item.unitPrice || 0);
      setValue(`expenseItems.${index}.amount`, amount);
    });
  }, [watchExpenseItems, setValue]);

  // ดึงเลขที่เอกสารล่าสุดเมื่อ modal เปิดหรือวันที่เปลี่ยน
  React.useEffect(() => {
    if (open && watchDate) {
      expenseService.getLatestDocumentNumber(watchDate).then((latestNumber) => {
        if (latestNumber) {
          const parts = latestNumber.split('-');
          const lastNumber = parseInt(parts[parts.length - 1]);
          const newNumber = String(lastNumber + 1).padStart(4, '0');
          parts[parts.length - 1] = newNumber;
          setValue('documentNumber', parts.join('-'));
        } else {
          const date = new Date(watchDate);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          setValue('documentNumber', `EXP-${year}-${month}-${day}-0001`);
        }
      });
    }
  }, [open, watchDate, setValue]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      // Convert form data to match Expense type
      const expenseData: Omit<Expense, 'id'> = {
        ...data,
        documentNumber: data.documentNumber || null,
        vendorName: data.vendorName || null,
        vendorDetail: data.vendorDetail || null,
        project: data.project || null,
        referenceNumber: data.referenceNumber || null,
        currency: data.currency || null,
        remark: data.remark || null,
        internalNote: data.internalNote || null,
        expenseItems: data.expenseItems.map(item => ({
          ...item,
          id: 0, // This will be set by the backend
          expenseId: 0 // This will be set by the backend
        }))
      };
      await expenseService.createExpense(expenseData);
      onCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 relative">
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        
        <h2 className="text-xl font-bold mb-4 text-blue-700">สร้างค่าใช้จ่าย</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label htmlFor="documentNumber" className="block text-sm font-medium">
                เลขที่เอกสาร
              </label>
              <input
                id="documentNumber"
                {...register('documentNumber')}
                className="w-full border rounded px-2 py-1"
                disabled={true}
              />
              {errors.documentNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.documentNumber.message}</p>
              )}

              <label htmlFor="vendorName" className="block text-sm font-medium mt-2">
                ชื่อผู้จำหน่าย
              </label>
              <input
                id="vendorName"
                {...register('vendorName')}
                className="w-full border rounded px-2 py-1"
              />
              {errors.vendorName && (
                <p className="text-red-500 text-sm mt-1">{errors.vendorName.message}</p>
              )}

              <label htmlFor="vendorDetail" className="block text-sm font-medium mt-2">
                ข้อมูลผู้จำหน่าย
              </label>
              <textarea
                id="vendorDetail"
                {...register('vendorDetail')}
                className="w-full border rounded px-2 py-1"
                rows={3}
              />
              {errors.vendorDetail && (
                <p className="text-red-500 text-sm mt-1">{errors.vendorDetail.message}</p>
              )}

              <label htmlFor="project" className="block text-sm font-medium mt-2">
                โปรเจ็ค
              </label>
              <input
                id="project"
                {...register('project')}
                className="w-full border rounded px-2 py-1"
              />
              {errors.project && (
                <p className="text-red-500 text-sm mt-1">{errors.project.message}</p>
              )}

              <label htmlFor="referenceNumber" className="block text-sm font-medium mt-2">
                เลขที่อ้างอิง
              </label>
              <input
                id="referenceNumber"
                {...register('referenceNumber')}
                className="w-full border rounded px-2 py-1"
              />
              {errors.referenceNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.referenceNumber.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <label htmlFor="date" className="block text-sm font-medium">
                วันที่
              </label>
              <input
                id="date"
                type="date"
                {...register('date')}
                className="w-full border rounded px-2 py-1"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}

              <label htmlFor="creditTerm" className="block text-sm font-medium mt-2">
                เครดิต (วัน)
              </label>
              <input
                id="creditTerm"
                type="number"
                {...register('creditTerm', { valueAsNumber: true })}
                className="w-full border rounded px-2 py-1 text-right"
              />
              {errors.creditTerm && (
                <p className="text-red-500 text-sm mt-1">{errors.creditTerm.message}</p>
              )}

              <label htmlFor="dueDate" className="block text-sm font-medium mt-2">
                ครบกำหนด
              </label>
              <input
                id="dueDate"
                type="date"
                {...register('dueDate')}
                className="w-full border rounded px-2 py-1"
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
              )}

              <label htmlFor="currency" className="block text-sm font-medium mt-2">
                สกุลเงิน
              </label>
              <select
                id="currency"
                {...register('currency')}
                className="w-full border rounded px-2 py-1"
              >
                <option value="THB">THB - ไทย</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
              {errors.currency && (
                <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>
              )}

              <label htmlFor="discount" className="block text-sm font-medium mt-2">
                ส่วนลด
              </label>
              <input
                id="discount"
                type="number"
                {...register('discount', { valueAsNumber: true })}
                className="w-full border rounded px-2 py-1 text-right"
              />
              {errors.discount && (
                <p className="text-red-500 text-sm mt-1">{errors.discount.message}</p>
              )}

              <div className="flex items-center mt-2">
                <input
                  id="vatIncluded"
                  type="checkbox"
                  {...register('vatIncluded')}
                  className="mr-2"
                />
                <label htmlFor="vatIncluded" className="text-sm font-medium">
                  ราคารวมภาษี
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="remark" className="block text-sm font-medium">
                หมายเหตุ
              </label>
              <textarea
                id="remark"
                {...register('remark')}
                className="w-full border rounded px-2 py-1"
                rows={2}
              />
              {errors.remark && (
                <p className="text-red-500 text-sm mt-1">{errors.remark.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="internalNote" className="block text-sm font-medium">
                บันทึกภายใน
              </label>
              <textarea
                id="internalNote"
                {...register('internalNote')}
                className="w-full border rounded px-2 py-1"
                rows={2}
              />
              {errors.internalNote && (
                <p className="text-red-500 text-sm mt-1">{errors.internalNote.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 mt-2">
            <span className="text-lg font-bold">จำนวนเงินรวมทั้งสิ้น:</span>
            <span className="text-2xl text-blue-600 font-bold">{watch('totalAmount').toFixed(2)}</span>
          </div>

          {/* รายละเอียดรายการ */}
          <div>
            <label className="block text-sm font-medium mb-2">รายละเอียดรายการค่าใช้จ่าย</label>
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded">
                <thead>
                  <tr className="bg-blue-400 text-white">
                    <th className="px-2 py-1">ลำดับ</th>
                    <th className="px-2 py-1">รายละเอียด</th>
                    <th className="px-2 py-1">หมวดหมู่</th>
                    <th className="px-2 py-1">จำนวน</th>
                    <th className="px-2 py-1">หน่วย</th>
                    <th className="px-2 py-1">ราคาต่อหน่วย</th>
                    <th className="px-2 py-1">ราคารวม</th>
                    <th className="px-2 py-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field: { id: string }, index: number) => (
                    <tr key={field.id} className="border-b">
                      <td className="px-2 py-1 text-center">{index + 1}</td>
                      <td className="px-2 py-1">
                        <input
                          {...register(`expenseItems.${index}.description`)}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          {...register(`expenseItems.${index}.category`)}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="number"
                          {...register(`expenseItems.${index}.quantity`, { valueAsNumber: true })}
                          className="w-full border rounded px-2 py-1 text-right"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          {...register(`expenseItems.${index}.unit`)}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="number"
                          {...register(`expenseItems.${index}.unitPrice`, { valueAsNumber: true })}
                          className="w-full border rounded px-2 py-1 text-right"
                        />
                      </td>
                      <td className="px-2 py-1 text-right">
                        {watchExpenseItems[index]?.amount.toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-center">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500"
                          >
                            ลบ
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={() => append({ description: '', category: '', quantity: 1, unit: '', unitPrice: 0, amount: 0 })}
                className="mt-2 px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50"
              >
                + เพิ่มแถวรายการ
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 