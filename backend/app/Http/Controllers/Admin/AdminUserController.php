<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = $request->get('page', 1);
        $role = $request->get('role', 'all');
        $cacheKey = "admin_users_page_{$page}_role_{$role}";

        // Cache dyal les utilisateurs l-mouddat 60 minutes
        $users = Cache::remember($cacheKey, 3600, function () use ($request) {
            $query = User::latest();

            if ($request->filled('role')) {
                $query->where('role', $request->role);
            }

            return $query->paginate(20);
        });

        return response()->json($users);
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
            'role' => 'required|string|in:customer,admin,supplier',
            'company_name' => 'nullable|string|max:255',
            'ice' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
        ]);

        $user = User::findOrFail($id);
        $user->update($validated);

        // Vider l-cache dyal users w dashboard stats
        $this->clearUserCaches();

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

        // Vider l-cache dyal users w dashboard stats
        $this->clearUserCaches();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Helper function bach t-ms7 cache dyal users w dashboard.
     */
    private function clearUserCaches(): void
    {
        Cache::forget('admin_dashboard_stats');
        Cache::flush();
    }
}