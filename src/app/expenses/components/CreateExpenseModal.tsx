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
  vendorName: z.string().min(1, 'ชื่อผู้จำหน่ายต้องมีอย่างน้อย 1 ตัวอักษร').nullable(),
  vendorDetail: z.string().min(1, 'ข้อมูลผู้จำหน่ายต้องมีอย่างน้อย 1 ตัวอักษร').nullable(),
  project: z.string().min(1, 'โครงการต้องมีอย่างน้อย 1 ตัวอักษร').nullable(),
  referenceNumber: z.string().nullable(),
  date: z.string(),
  creditTerm: z.number().min(0),
  dueDate: z.string(),
  currency: z.string().nullable(),
  discount: z.number().min(0),
  remark: z.string().min(1, 'หมายเหตุต้องมีอย่างน้อย 1 ตัวอักษร').nullable(),
  internalNote: z.string().min(1, 'บันทึกภายในต้องมีอย่างน้อย 1 ตัวอักษร').nullable(),
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
    watch,
    reset
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
  const watchDiscount = watch('discount');

  const resetForm = () => {
    reset({
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
      remark: '',
      internalNote: '',
      totalAmount: 0,
      expenseItems: [
        { description: '', category: '', quantity: 1, unit: '', unitPrice: 0, amount: 0 }
      ]
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddItem = () => {
    append({ description: '', category: '', quantity: 1, unit: '', unitPrice: 0, amount: 0 });
  };

  // Calculate item amount whenever quantity or unit price changes
  React.useEffect(() => {
    watchExpenseItems.forEach((item: FormExpenseItem, index: number) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const amount = Number((quantity * unitPrice).toFixed(2));
      setValue(`expenseItems.${index}.amount`, amount);
    });
  }, [watchExpenseItems, setValue]);

  // Calculate total amount whenever expense items change
  React.useEffect(() => {
    const total = watchExpenseItems.reduce((sum: number, item: FormExpenseItem) => {
      const amount = Number(item.amount) || 0;
      return Number((sum + amount).toFixed(2));
    }, 0);
    setValue('totalAmount', total);
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

  const discountedAmount = React.useMemo(() => {
    const total = Number(watch('totalAmount')) || 0;
    const discount = Number(watchDiscount) || 0;
    return Number((total - (total * discount / 100)).toFixed(2));
  }, [watch('totalAmount'), watchDiscount]);

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
        vatIncluded: false,
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-blue-700">สร้างค่าใช้จ่าย</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* กลุ่ม: ข้อมูลเอกสารและผู้จำหน่าย */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="documentNumber" className="block text-sm font-semibold text-gray-700 mb-1">
                  เลขที่เอกสาร
                </label>
                <input
                  id="documentNumber"
                  {...register('documentNumber')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  disabled={true}
                />
                {errors.documentNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.documentNumber.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1">
                  วันที่
                </label>
                <input
                  id="date"
                  type="date"
                  {...register('date')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="vendorName" className="block text-sm font-semibold text-gray-700 mb-1 mt-2 md:mt-0">
                  ชื่อผู้จำหน่าย
                </label>
                <input
                  id="vendorName"
                  {...register('vendorName')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.vendorName && (
                  <p className="text-red-500 text-xs mt-1">{errors.vendorName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="creditTerm" className="block text-sm font-semibold text-gray-700 mb-1 mt-2 md:mt-0">
                  เครดิต (วัน)
                </label>
                <input
                  id="creditTerm"
                  type="number"
                  {...register('creditTerm', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.creditTerm && (
                  <p className="text-red-500 text-xs mt-1">{errors.creditTerm.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="vendorDetail" className="block text-sm font-semibold text-gray-700 mb-1 mt-2">
                  ข้อมูลผู้จำหน่าย
                </label>
                <textarea
                  id="vendorDetail"
                  {...register('vendorDetail')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  rows={3}
                />
                {errors.vendorDetail && (
                  <p className="text-red-500 text-xs mt-1">{errors.vendorDetail.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* กลุ่ม: รายละเอียดเอกสาร */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="project" className="block text-sm font-semibold text-gray-700 mb-1">
                  โครงการ
                </label>
                <input
                  id="project"
                  {...register('project')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.project && (
                  <p className="text-red-500 text-xs mt-1">{errors.project.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-1">
                  ครบกำหนด
                </label>
                <input
                  id="dueDate"
                  type="date"
                  {...register('dueDate')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="referenceNumber" className="block text-sm font-semibold text-gray-700 mb-1">
                  เลขที่อ้างอิง
                </label>
                <input
                  id="referenceNumber"
                  {...register('referenceNumber')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.referenceNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.referenceNumber.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-semibold text-gray-700 mb-1">
                  สกุลเงิน
                </label>
                <select
                  id="currency"
                  {...register('currency')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <option value="THB">THB - ไทย</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
                {errors.currency && (
                  <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="discount" className="block text-sm font-semibold text-gray-700 mb-1">
                  ส่วนลด (เปอร์เซ็นต์)
                </label>
                <input
                  id="discount"
                  type="number"
                  {...register('discount', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.discount && (
                  <p className="text-red-500 text-xs mt-1">{errors.discount.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* กลุ่ม: หมายเหตุ/บันทึกภายใน */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="remark" className="block text-sm font-semibold text-gray-700 mb-1">
                หมายเหตุ
              </label>
              <textarea
                id="remark"
                {...register('remark')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                rows={2}
              />
              {errors.remark && (
                <p className="text-red-500 text-xs mt-1">{errors.remark.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="internalNote" className="block text-sm font-semibold text-gray-700 mb-1">
                บันทึกภายใน
              </label>
              <textarea
                id="internalNote"
                {...register('internalNote')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                rows={2}
              />
              {errors.internalNote && (
                <p className="text-red-500 text-xs mt-1">{errors.internalNote.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 mt-2 mb-6">
            <div className="flex flex-col items-end mr-8">
              <span className="text-blue-600 font-semibold">รวมเป็นเงิน</span>
              <span className="text-2xl text-black font-bold">
                {Number(watch('totalAmount') || 0).toLocaleString('th-TH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
            <div className="flex flex-col items-end mr-8">
              <span className="text-blue-600 font-semibold">ราคาหลังหักส่วนลด</span>
              <span className="text-2xl text-black font-bold">
                {discountedAmount.toLocaleString('th-TH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold">จำนวนเงินรวมทั้งสิ้น:</span>
              <span className="text-2xl text-blue-600 font-bold">
                {discountedAmount.toLocaleString('th-TH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          </div>

          {/* รายละเอียดรายการ */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">รายละเอียดรายการค่าใช้จ่าย</label>
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-lg shadow-sm bg-white border-gray-200">
                <thead>
                  <tr className="bg-blue-400 text-white">
                    <th className="px-2 py-2">ลำดับ</th>
                    <th className="px-2 py-2">รายละเอียด</th>
                    <th className="px-2 py-2">หมวดหมู่</th>
                    <th className="px-2 py-2">จำนวน</th>
                    <th className="px-2 py-2">หน่วย</th>
                    <th className="px-2 py-2">ราคาต่อหน่วย</th>
                    <th className="px-2 py-2 whitespace-nowrap">ราคารวม</th>
                    <th className="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field: { id: string }, index: number) => (
                    <tr key={field.id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                      <td className="px-2 py-2 text-center">{index + 1}</td>
                      <td className="px-2 py-2">
                        <input
                          {...register(`expenseItems.${index}.description`)}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          {...register(`expenseItems.${index}.category`)}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          {...register(`expenseItems.${index}.quantity`, { 
                            valueAsNumber: true,
                            onChange: (e) => {
                              const value = Number(e.target.value) || 0;
                              setValue(`expenseItems.${index}.quantity`, value);
                              const unitPrice = Number(watchExpenseItems[index]?.unitPrice) || 0;
                              const amount = Number((value * unitPrice).toFixed(2));
                              setValue(`expenseItems.${index}.amount`, amount);
                              
                              // Calculate total amount
                              const items = watchExpenseItems.map((item, i) => {
                                if (i === index) {
                                  return { ...item, amount };
                                }
                                return item;
                              });
                              const total = items.reduce((sum, item) => Number((sum + (Number(item.amount) || 0)).toFixed(2)), 0);
                              setValue('totalAmount', total);
                            }
                          })}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          {...register(`expenseItems.${index}.unit`)}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          {...register(`expenseItems.${index}.unitPrice`, { 
                            valueAsNumber: true,
                            onChange: (e) => {
                              const value = Number(e.target.value) || 0;
                              setValue(`expenseItems.${index}.unitPrice`, value);
                              const quantity = Number(watchExpenseItems[index]?.quantity) || 0;
                              const amount = Number((quantity * value).toFixed(2));
                              setValue(`expenseItems.${index}.amount`, amount);
                              
                              // Calculate total amount
                              const items = watchExpenseItems.map((item, i) => {
                                if (i === index) {
                                  return { ...item, amount };
                                }
                                return item;
                              });
                              const total = items.reduce((sum, item) => Number((sum + (Number(item.amount) || 0)).toFixed(2)), 0);
                              setValue('totalAmount', total);
                            }
                          })}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                      </td>
                      <td className="px-2 py-2 text-right">
                        {Number(watchExpenseItems[index]?.amount || 0).toLocaleString('th-TH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:underline text-sm"
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
                onClick={handleAddItem}
                className="mt-3 px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition"
              >
                + เพิ่มแถวรายการ
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 