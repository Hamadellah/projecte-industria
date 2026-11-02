<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::latest();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        return response()->json($query->paginate(20));
    }

    // Ziyada dyal show client b details dyalu w les commandes dyalu
    public function show(int $id): JsonResponse
    {
        $user = User::with(['orders', 'quotations'])->findOrFail($id);
        return response()->json($user);
    }

    public function updateRole(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'role' => 'required|string|in:customer,admin',
            'company_name' => 'nullable|string|max:255',
            'ice' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
        ]);

        $user = User::findOrFail($id);
        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        
        if ($user->id === request()->user()->id) {
            return response()->json(['message' => 'You cannot delete your own account'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}